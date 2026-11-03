"""Flask backend for the Personal Knowledge Assistant (with auth)."""

from __future__ import annotations

import os
import uuid
from pathlib import Path
from typing import Optional

from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS

from kb import KnowledgeBase

DEFAULT_SECRET = "dev-secret-change-in-production"
UPLOAD_DIR = Path("uploads")

app = Flask(__name__, template_folder="templates")
app.secret_key = os.environ.get("SECRET_KEY", DEFAULT_SECRET)
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16 MB per upload
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"

if app.secret_key == DEFAULT_SECRET:
    print("WARNING: using the default SECRET_KEY. Set SECRET_KEY before deploying.")

# Only the listed origins may call the API with the login cookie.
# (The Vite dev server proxies /api, so the default is enough for local work.)
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get("CORS_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]
CORS(app, supports_credentials=True, origins=ALLOWED_ORIGINS)

kb = KnowledgeBase()


def current_user_id() -> Optional[int]:
    return session.get("user_id")


def clean(value) -> str:
    """Strip a JSON/form value; anything that is not text becomes an empty string."""
    return value.strip() if isinstance(value, str) else ""


# ------------------------------------------------------------------
# Auth
# ------------------------------------------------------------------
@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    username = clean(data.get("username"))
    password = data.get("password") if isinstance(data.get("password"), str) else ""

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    try:
        user_id = kb.create_user(username, password)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    session["user_id"] = user_id
    session["username"] = username
    return jsonify({"user_id": user_id, "username": username})


@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    username = clean(data.get("username"))
    password = data.get("password") if isinstance(data.get("password"), str) else ""

    user_id = kb.verify_password(username, password)
    if not user_id:
        return jsonify({"error": "Invalid credentials"}), 401

    session["user_id"] = user_id
    session["username"] = username
    return jsonify({"user_id": user_id, "username": username})


@app.route("/api/auth/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"ok": True})


@app.route("/api/auth/me", methods=["GET"])
def me():
    uid = current_user_id()
    if not uid:
        return jsonify({"authenticated": False}), 401
    return jsonify({"authenticated": True, "user_id": uid, "username": session.get("username")})


# ------------------------------------------------------------------
# Documents (user-scoped)
# ------------------------------------------------------------------
@app.route("/api/documents", methods=["GET"])
def list_documents():
    uid = current_user_id()
    if not uid:
        return jsonify({"error": "Not authenticated"}), 401
    docs = [
        {"id": d[0], "title": d[1], "source_type": d[2], "created_at": d[3]}
        for d in kb.list_documents(uid)
    ]
    return jsonify(documents=docs)


@app.route("/api/documents", methods=["POST"])
def add_document():
    uid = current_user_id()
    if not uid:
        return jsonify({"error": "Not authenticated"}), 401

    title = clean(request.form.get("title"))
    content = clean(request.form.get("content"))
    file = request.files.get("file")

    if file and file.filename:
        # the file name is only used for the default title, never as a path on disk
        stem = Path(file.filename).stem
        filename = file.filename.lower()

        if filename.endswith(".pdf"):
            UPLOAD_DIR.mkdir(exist_ok=True)
            tmp = UPLOAD_DIR / f"{uuid.uuid4().hex}.pdf"
            file.save(tmp)
            try:
                doc_id = kb.add_pdf(uid, title or stem, tmp)
            except ValueError as exc:
                return jsonify({"error": str(exc)}), 400
            except Exception:
                return jsonify({"error": "Could not read this PDF."}), 400
            finally:
                tmp.unlink(missing_ok=True)
            return jsonify({"id": doc_id, "title": title or stem, "source_type": "pdf"})

        if not filename.endswith((".txt", ".md")):
            return jsonify({"error": "Only .txt, .md and .pdf files are supported"}), 400

        content = file.read().decode("utf-8", errors="ignore").strip()
        title = title or stem

    if not title or not content:
        return jsonify({"error": "Title and content are required"}), 400

    try:
        doc_id = kb.add_document(uid, title, content)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    return jsonify({"id": doc_id, "title": title, "source_type": "text"})


@app.route("/api/documents/<int:doc_id>", methods=["DELETE"])
def delete_document(doc_id: int):
    uid = current_user_id()
    if not uid:
        return jsonify({"error": "Not authenticated"}), 401
    if kb.delete_document(uid, doc_id):
        return jsonify({"ok": True})
    return jsonify({"error": "Document not found"}), 404


# ------------------------------------------------------------------
# Q&A (user-scoped)
# ------------------------------------------------------------------
@app.route("/api/ask", methods=["POST"])
def ask():
    uid = current_user_id()
    if not uid:
        return jsonify({"error": "Not authenticated"}), 401

    data = request.get_json(silent=True) or {}
    query = clean(data.get("query"))
    session_id = clean(data.get("session_id")) or str(uuid.uuid4())

    if not query:
        return jsonify({"error": "Query is required"}), 400

    result = kb.ask(uid, query, session_id=session_id)
    return jsonify({
        "answer": result["answer"],
        "sources": result["sources"],
        "session_id": session_id,
    })


# ------------------------------------------------------------------
# Conversation history (user-scoped)
# ------------------------------------------------------------------
@app.route("/api/history", methods=["GET"])
def history():
    uid = current_user_id()
    if not uid:
        return jsonify({"error": "Not authenticated"}), 401

    session_id = request.args.get("session_id", "default")
    try:
        limit = max(1, min(int(request.args.get("limit", 20)), 100))
    except ValueError:
        limit = 20
    return jsonify(history=kb.get_conversation_history(uid, session_id=session_id, limit=limit))


# ------------------------------------------------------------------
# Fallback UI
# ------------------------------------------------------------------
@app.route("/")
def index():
    uid = current_user_id()
    if not uid:
        return render_template("index.html", documents=[], authenticated=False, username="")
    docs = [
        {"id": d[0], "title": d[1], "source_type": d[2], "created_at": d[3]}
        for d in kb.list_documents(uid)
    ]
    return render_template(
        "index.html", documents=docs, authenticated=True, username=session.get("username", "")
    )


if __name__ == "__main__":
    # debug mode lets anyone who reaches the server run code, so it is off unless asked for
    app.run(
        debug=os.environ.get("FLASK_DEBUG") == "1",
        host=os.environ.get("HOST", "127.0.0.1"),
        port=int(os.environ.get("PORT", 5000)),
    )
