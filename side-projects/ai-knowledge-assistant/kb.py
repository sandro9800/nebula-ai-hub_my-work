"""Personal Knowledge Assistant — RAG with auth, ownership, and chunking."""

from __future__ import annotations

import os
import shlex
import sqlite3
import threading
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Tuple, Optional, Dict, Any

import numpy as np
import requests
from sentence_transformers import SentenceTransformer
from pypdf import PdfReader
from werkzeug.security import generate_password_hash, check_password_hash

DB_PATH = Path(os.environ.get("KNOWLEDGE_DB", "knowledge.db"))
EMBED_MODEL = "all-MiniLM-L6-v2"
CHUNK_SIZE = 500      # characters per chunk
CHUNK_OVERLAP = 50    # overlap between chunks
MIN_PASSWORD_LENGTH = 6
OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434/api/generate")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "llama3.2")


class KnowledgeBase:
    def __init__(self, db_path: Path = DB_PATH) -> None:
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._local = threading.local()
        self.conn.execute("PRAGMA journal_mode=WAL")
        self._init_db()
        self.model = SentenceTransformer(EMBED_MODEL)

    @property
    def conn(self) -> sqlite3.Connection:
        """One SQLite connection per thread (the web server handles requests in threads)."""
        conn = getattr(self._local, "conn", None)
        if conn is None:
            conn = sqlite3.connect(self.db_path)
            self._local.conn = conn
        return conn

    # ------------------------------------------------------------------
    # Schema
    # ------------------------------------------------------------------
    def _init_db(self) -> None:
        self.conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS documents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                source_type TEXT DEFAULT 'text',
                created_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS document_chunks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                document_id INTEGER NOT NULL,
                chunk_index INTEGER NOT NULL,
                content TEXT NOT NULL,
                embedding BLOB,
                FOREIGN KEY (document_id) REFERENCES documents(id)
            );

            CREATE TABLE IF NOT EXISTS conversations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                session_id TEXT NOT NULL,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS conversation_sources (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                conversation_id INTEGER NOT NULL,
                document_id INTEGER NOT NULL,
                FOREIGN KEY (conversation_id) REFERENCES conversations(id),
                FOREIGN KEY (document_id) REFERENCES documents(id)
            );
            """
        )
        self.conn.commit()

    # ------------------------------------------------------------------
    # Users & Auth
    # ------------------------------------------------------------------
    def create_user(self, username: str, password: str) -> int:
        """Create a new user. Returns user id or raises ValueError if exists."""
        username = username.strip()
        if not username:
            raise ValueError("Username is required")
        if len(password) < MIN_PASSWORD_LENGTH:
            raise ValueError(f"Password must be at least {MIN_PASSWORD_LENGTH} characters")
        if self.get_user_by_username(username):
            raise ValueError("Username already exists")
        pw_hash = generate_password_hash(password)
        now = datetime.now(timezone.utc).isoformat()
        try:
            cur = self.conn.execute(
                "INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?)",
                (username, pw_hash, now),
            )
            self.conn.commit()
        except sqlite3.IntegrityError:
            raise ValueError("Username already exists") from None
        return int(cur.lastrowid)

    def get_user_by_username(self, username: str) -> Optional[Tuple]:
        return self.conn.execute(
            "SELECT id, username, password_hash FROM users WHERE username = ?",
            (username,),
        ).fetchone()

    def verify_password(self, username: str, password: str) -> Optional[int]:
        """Verify credentials. Returns user id if valid, None otherwise."""
        user = self.get_user_by_username(username)
        if user and check_password_hash(user[2], password):
            return user[0]
        return None

    # ------------------------------------------------------------------
    # Documents (with chunking)
    # ------------------------------------------------------------------
    @staticmethod
    def _chunk_text(text: str, size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> List[str]:
        """Split text into overlapping chunks."""
        if len(text) <= size:
            return [text]
        chunks = []
        start = 0
        while start < len(text):
            end = min(start + size, len(text))
            chunks.append(text[start:end])
            if end >= len(text):
                break
            start = end - overlap
        return chunks

    def add_document(
        self,
        user_id: int,
        title: str,
        content: str,
        source_type: str = "text",
    ) -> int:
        """Store a document, chunk it, embed each chunk, and save."""
        if not content.strip():
            raise ValueError("Document content is empty")

        # embed first, so nothing is written if the model fails
        chunks = self._chunk_text(content)
        embeddings = [
            self.model.encode(chunk, convert_to_numpy=True).astype(np.float32)
            for chunk in chunks
        ]

        now = datetime.now(timezone.utc).isoformat()
        try:
            cur = self.conn.execute(
                """
                INSERT INTO documents (user_id, title, source_type, created_at)
                VALUES (?, ?, ?, ?)
                """,
                (user_id, title, source_type, now),
            )
            doc_id = int(cur.lastrowid)
            for idx, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
                self.conn.execute(
                    """
                    INSERT INTO document_chunks (document_id, chunk_index, content, embedding)
                    VALUES (?, ?, ?, ?)
                    """,
                    (doc_id, idx, chunk, embedding.tobytes()),
                )
            self.conn.commit()
        except Exception:
            self.conn.rollback()
            raise
        return doc_id

    def add_pdf(self, user_id: int, title: str, file_path: Path) -> int:
        """Extract text from a PDF, chunk it, and store."""
        reader = PdfReader(str(file_path))
        content = "\n".join((page.extract_text() or "") for page in reader.pages).strip()
        if not content:
            raise ValueError("No text could be extracted from the PDF.")
        return self.add_document(user_id, title, content, source_type="pdf")

    def list_documents(self, user_id: int) -> List[Tuple[int, str, str, str]]:
        return self.conn.execute(
            """
            SELECT id, title, source_type, created_at
            FROM documents
            WHERE user_id = ?
            ORDER BY id DESC
            """,
            (user_id,),
        ).fetchall()

    def delete_document(self, user_id: int, doc_id: int) -> bool:
        owned = self.conn.execute(
            "SELECT 1 FROM documents WHERE id = ? AND user_id = ?",
            (doc_id, user_id),
        ).fetchone()
        if not owned:
            return False
        try:
            # remove everything that belongs to the document, not only the document row
            self.conn.execute("DELETE FROM conversation_sources WHERE document_id = ?", (doc_id,))
            self.conn.execute("DELETE FROM document_chunks WHERE document_id = ?", (doc_id,))
            self.conn.execute("DELETE FROM documents WHERE id = ?", (doc_id,))
            self.conn.commit()
        except Exception:
            self.conn.rollback()
            raise
        return True

    # ------------------------------------------------------------------
    # Semantic Search (across chunks)
    # ------------------------------------------------------------------
    def search(
        self,
        user_id: int,
        query: str,
        top_k: int = 3,
    ) -> List[Tuple[float, int, str, str]]:
        """Semantic search over a user's document chunks."""
        query_emb = self.model.encode(query, convert_to_numpy=True)
        rows = self.conn.execute(
            """
            SELECT dc.id, d.id, d.title, dc.content, dc.embedding
            FROM document_chunks dc
            JOIN documents d ON d.id = dc.document_id
            WHERE d.user_id = ?
            """,
            (user_id,),
        ).fetchall()

        results: List[Tuple[float, int, str, str]] = []
        for chunk_id, doc_id, title, content, emb_blob in rows:
            emb = np.frombuffer(emb_blob, dtype=np.float32)
            denom = float(np.linalg.norm(query_emb) * np.linalg.norm(emb))
            if denom == 0:
                continue
            score = float(np.dot(query_emb, emb) / denom)
            results.append((score, doc_id, title, content))

        results.sort(key=lambda x: x[0], reverse=True)
        return results[:top_k]

    # ------------------------------------------------------------------
    # Q&A
    # ------------------------------------------------------------------
    def ask(
        self,
        user_id: int,
        query: str,
        session_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        if session_id is None:
            session_id = "default"

        top = self.search(user_id, query)
        if not top:
            answer = "No documents in your knowledge base. Add some first."
            self._save_conversation(user_id, session_id, query, answer, [])
            return {"answer": answer, "sources": []}

        context = "\n\n---\n\n".join(
            f"[{title}]\n{content}" for _, _, title, content in top
        )

        prompt = (
            "Answer the user's question using ONLY the provided context. "
            "If the answer isn't in the context, say so. "
            "Cite sources by their title.\n\n"
            f"CONTEXT:\n{context}\n\n"
            f"QUESTION:\n{query}\n\n"
            "ANSWER:"
        )

        answer = self._query_ollama(prompt, fallback=top[0])
        sources = [{"id": doc_id, "title": title} for _, doc_id, title, _ in top]
        self._save_conversation(user_id, session_id, query, answer, sources)
        return {"answer": answer, "sources": sources}

    def _save_conversation(
        self,
        user_id: int,
        session_id: str,
        question: str,
        answer: str,
        sources: List[dict],
    ) -> int:
        now = datetime.now(timezone.utc).isoformat()
        cur = self.conn.execute(
            """
            INSERT INTO conversations (user_id, session_id, question, answer, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (user_id, session_id, question, answer, now),
        )
        conv_id = int(cur.lastrowid)
        for s in sources:
            self.conn.execute(
                """
                INSERT INTO conversation_sources (conversation_id, document_id)
                VALUES (?, ?)
                """,
                (conv_id, s["id"]),
            )
        self.conn.commit()
        return conv_id

    def get_conversation_history(
        self, user_id: int, session_id: str = "default", limit: int = 20
    ) -> List[Dict[str, Any]]:
        rows = self.conn.execute(
            """
            SELECT c.id, c.question, c.answer, c.created_at
            FROM conversations c
            WHERE c.user_id = ? AND c.session_id = ?
            ORDER BY c.id DESC
            LIMIT ?
            """,
            (user_id, session_id, limit),
        ).fetchall()
        history = []
        for conv_id, question, answer, created_at in rows:
            source_rows = self.conn.execute(
                """
                SELECT d.id, d.title
                FROM conversation_sources cs
                JOIN documents d ON d.id = cs.document_id
                WHERE cs.conversation_id = ?
                """,
                (conv_id,),
            ).fetchall()
            history.append(
                {
                    "id": conv_id,
                    "question": question,
                    "answer": answer,
                    "created_at": created_at,
                    "sources": [{"id": r[0], "title": r[1]} for r in source_rows],
                }
            )
        return history

    # ------------------------------------------------------------------
    # LLM
    # ------------------------------------------------------------------
    def _query_ollama(self, prompt: str, fallback: Tuple[float, int, str, str]) -> str:
        """Ask Ollama. If it is unavailable, return the best excerpt that was already found
        for this user (never search again, so no other user's documents can leak)."""
        try:
            resp = requests.post(
                OLLAMA_URL,
                json={"model": OLLAMA_MODEL, "prompt": prompt, "stream": False},
                timeout=60,
            )
            if resp.status_code == 200:
                return resp.json().get("response", "No answer returned.")
        except Exception:
            pass

        _, _, title, content = fallback
        excerpt = content[:800] + ("..." if len(content) > 800 else "")
        return (
            "Ollama is not available. Here is the most relevant excerpt:\n\n"
            f"Source: {title}\n{excerpt}"
        )

    def close(self) -> None:
        conn = getattr(self._local, "conn", None)
        if conn is not None:
            conn.close()
            self._local.conn = None


def main() -> None:
    kb = KnowledgeBase()
    print("Personal Knowledge Assistant")
    print("Commands: register <user> <pass> | login <user> <pass> | add <title> <file> | pdf <title> <file> | ask <question> | list | history | quit")

    current_user: Optional[int] = None

    while True:
        try:
            user_input = input("\n> ").strip()
        except (EOFError, KeyboardInterrupt):
            break

        if not user_input:
            continue
        if user_input in {"quit", "exit"}:
            break

        # shlex lets titles and questions be quoted: add "Meeting Notes" notes.txt
        try:
            parts = shlex.split(user_input)
        except ValueError as exc:
            print(f"Error: {exc}")
            continue
        cmd = parts[0].lower()
        args = parts[1:]

        if cmd == "register":
            if len(args) < 2:
                print("Usage: register <username> <password>")
                continue
            try:
                uid = kb.create_user(args[0], args[1])
                print(f"User created with id {uid}")
            except ValueError as exc:
                print(f"Error: {exc}")

        elif cmd == "login":
            if len(args) < 2:
                print("Usage: login <username> <password>")
                continue
            uid = kb.verify_password(args[0], args[1])
            if uid:
                current_user = uid
                print(f"Logged in as user #{current_user}")
            else:
                print("Invalid credentials")

        elif cmd == "list":
            if not current_user:
                print("Please login first")
                continue
            for doc_id, title, src, created in kb.list_documents(current_user):
                print(f"  {doc_id}: {title} [{src}]")

        elif cmd == "add":
            if not current_user:
                print("Please login first")
                continue
            if len(args) < 2:
                print("Usage: add <title> <file.txt>")
                continue
            title, path = args[0], args[1]
            try:
                content = Path(path).read_text(encoding="utf-8")
                doc_id = kb.add_document(current_user, title, content)
                print(f"Added document #{doc_id}: {title}")
            except Exception as exc:
                print(f"Error: {exc}")

        elif cmd == "pdf":
            if not current_user:
                print("Please login first")
                continue
            if len(args) < 2:
                print("Usage: pdf <title> <file.pdf>")
                continue
            title, path = args[0], args[1]
            try:
                doc_id = kb.add_pdf(current_user, title, Path(path))
                print(f"Added PDF document #{doc_id}: {title}")
            except Exception as exc:
                print(f"Error: {exc}")

        elif cmd == "ask":
            if not current_user:
                print("Please login first")
                continue
            if not args:
                print("Usage: ask <question>")
                continue
            result = kb.ask(current_user, " ".join(args))
            print("\n" + result["answer"])
            if result["sources"]:
                print("\nSources:")
                for s in result["sources"]:
                    print(f"  - [{s['id']}] {s['title']}")

        elif cmd == "history":
            if not current_user:
                print("Please login first")
                continue
            for item in kb.get_conversation_history(current_user):
                print(f"\n[{item['created_at']}] Q: {item['question']}")
                print(f"         A: {item['answer'][:200]}...")
                if item["sources"]:
                    names = ", ".join("[{}] {}".format(s["id"], s["title"]) for s in item["sources"])
                    print(f"         Sources: {names}")

        else:
            print("Unknown command. Try: register, login, add, pdf, ask, list, history, quit")

    kb.close()


if __name__ == "__main__":
    main()
