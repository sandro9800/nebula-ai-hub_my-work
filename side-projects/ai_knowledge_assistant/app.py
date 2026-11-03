"""Flask backend for the Personal Knowledge Assistant (with auth)."""

from __future__ import annotations

import uuid
import os
from pathlib import Path
from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS

from kb import KnowledgeBase

app = Flask(__name__, template_folder="templates", static_folder="static")
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-change-in-production")
CORS(app, supports_credentials=True)

kb = KnowledgeBase()


def current_user_id() -> Optional[int]:
    return session.get("user_id")


from typing import Optional  # noqa: E402


# ------------------------------------------------------------------
# Auth
# ------------------------------------------------------------------
@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    username = data.get("username", "").strip()
    password = data.get("password", "")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    try:
        user_id = kb.create_user(username, password)
        session["user_id"] = user_id
        session["username"] = username
        return jsonify({"user_id": user_id, "username": username})
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400


@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    username = data.get("username", "").strip()
    password = data.get("password", "")

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

    title = request.form.get("title", "").strip()
    content = request.form.get("content", "").strip()
    file = request.files.get("file")

    if file and file.filename:
        filename = file.filename.lower()
        if filename.endswith(".pdf"):
            tmp = Path("uploads") / file.filename
            tmp.parent.mkdir(exist_ok=True)
            file.save(tmp)
            try:
                doc_id = kb.add_pdf(uid, title or Path(file.filename).stem, tmp)
            finally:
                tmp.unlink(missing_ok=True)
            return jsonify({
                "id": doc_id,
                "title": title or Path(file.filename).stem,
                "source_type": "pdf",
            })
        else:
            content = file.read().decode("utf-8", errors="ignore")
            title = title or Path(file.filename).stem

    if not title or not content:
        return jsonify({"error": "Title and content are required"}), 400

    doc_id = kb.add_document(uid, title, content)
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
    query = data.get("query", "").strip()
    session_id = data.get("session_id") or str(uuid.uuid4())

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
    limit = int(request.args.get("limit", 20))
    return jsonify(history=kb.get_conversation_history(uid, session_id=session_id, limit=limit))


# ------------------------------------------------------------------
# Fallback UI
# ------------------------------------------------------------------
@app.route("/")
def index():
    if not current_user_id():
        return render_template("index.html", documents=[], authenticated=False)
    docs = [
        {"id": d[0], "title": d[1], "source_type": d[2], "created_at": d[3]}
        for d in kb.list_documents(current_user_id())
    ]
    return render_template("index.html", documents=docs, authenticated=True)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
