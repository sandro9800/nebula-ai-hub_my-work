"""Tests for the knowledge base and the Flask API.

The real embedding model is replaced by a tiny fake one so the tests run in a second
and need no download. Run with:  python -m unittest -v
"""

import io
import os
import sys
import tempfile
import types
import unittest
from pathlib import Path

import numpy as np

# --- set up the environment before kb.py / app.py are imported ---------------
TMP = tempfile.mkdtemp()
os.environ["KNOWLEDGE_DB"] = str(Path(TMP) / "api.db")
os.environ["OLLAMA_URL"] = "http://127.0.0.1:9/api/generate"  # nothing listens here


class FakeModel:
    def __init__(self, name):
        pass

    def encode(self, text, convert_to_numpy=True):
        vec = np.zeros(32, dtype=np.float32)
        for word in text.lower().split():
            vec[sum(map(ord, word)) % 32] += 1
        return vec


fake_module = types.ModuleType("sentence_transformers")
fake_module.SentenceTransformer = FakeModel
sys.modules["sentence_transformers"] = fake_module
sys.path.insert(0, str(Path(__file__).resolve().parent))
os.chdir(Path(__file__).resolve().parent)

import kb as kb_module  # noqa: E402
import app as app_module  # noqa: E402


class KnowledgeBaseTests(unittest.TestCase):
    def setUp(self):
        self.kb = kb_module.KnowledgeBase(Path(tempfile.mkdtemp()) / "kb.db")
        self.alice = self.kb.create_user("alice", "password1")
        self.bob = self.kb.create_user("bob", "password2")

    def test_users(self):
        self.assertEqual(self.kb.verify_password("alice", "password1"), self.alice)
        self.assertIsNone(self.kb.verify_password("alice", "wrong"))
        with self.assertRaises(ValueError):
            self.kb.create_user("alice", "password1")
        with self.assertRaises(ValueError):
            self.kb.create_user("carol", "123")

    def test_user_cannot_see_other_users_documents(self):
        self.kb.add_document(self.alice, "Alice secret", "apples are alice's secret plan")
        result = self.kb.ask(self.bob, "apples secret plan")
        self.assertEqual(result["sources"], [])
        self.assertNotIn("alice", result["answer"].lower())

    def test_fallback_answer_uses_the_asking_users_documents(self):
        self.kb.add_document(self.alice, "Alice secret", "apples are alice's secret plan")
        self.kb.add_document(self.bob, "Bob notes", "bananas are on the shopping list")
        result = self.kb.ask(self.bob, "what is on the list")  # Ollama is not running
        self.assertIn("Bob notes", result["answer"])
        self.assertNotIn("Alice secret", result["answer"])

    def test_delete_removes_chunks_and_respects_owner(self):
        doc_id = self.kb.add_document(self.alice, "Doc", "some text " * 100)
        self.assertFalse(self.kb.delete_document(self.bob, doc_id))
        self.assertTrue(self.kb.delete_document(self.alice, doc_id))
        count = self.kb.conn.execute("SELECT COUNT(*) FROM document_chunks").fetchone()[0]
        self.assertEqual(count, 0)

    def test_chunks_overlap_and_cover_the_text(self):
        text = "".join(str(i % 10) for i in range(1200))
        chunks = self.kb._chunk_text(text)
        self.assertGreater(len(chunks), 1)
        self.assertEqual(chunks[0], text[:500])
        self.assertEqual(chunks[1][:50], chunks[0][-50:])
        self.assertTrue(chunks[-1].endswith(text[-20:]))

    def test_empty_document_is_rejected(self):
        with self.assertRaises(ValueError):
            self.kb.add_document(self.alice, "Empty", "   ")

    def test_failed_embedding_leaves_nothing_behind(self):
        original = self.kb.model.encode

        def broken(*args, **kwargs):
            raise RuntimeError("model crashed")

        self.kb.model.encode = broken
        with self.assertRaises(RuntimeError):
            self.kb.add_document(self.alice, "Broken", "text")
        self.kb.model.encode = original
        self.assertEqual(self.kb.list_documents(self.alice), [])
        self.kb.add_document(self.alice, "Fine", "text")
        self.assertEqual(len(self.kb.list_documents(self.alice)), 1)


class ApiTests(unittest.TestCase):
    def setUp(self):
        app_module.app.config["TESTING"] = True
        self.client = app_module.app.test_client()

    def register(self, name):
        return self.client.post("/api/auth/register", json={"username": name, "password": "secret123"})

    def test_requires_login(self):
        for method, url in [("get", "/api/documents"), ("post", "/api/ask"), ("get", "/api/history")]:
            self.assertEqual(getattr(self.client, method)(url).status_code, 401)

    def test_register_validation(self):
        self.assertEqual(self.client.post("/api/auth/register", json={"username": "x", "password": "123"}).status_code, 400)
        self.assertEqual(self.client.post("/api/auth/register", json={"username": 5, "password": ["a"]}).status_code, 400)

    def test_add_ask_and_history(self):
        self.assertEqual(self.register("api_user").status_code, 200)
        res = self.client.post("/api/documents", data={"title": "Policy", "content": "Vacation is 25 days per year."})
        self.assertEqual(res.status_code, 200)
        res = self.client.post("/api/ask", json={"query": "How many vacation days?", "session_id": "s1"})
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.get_json()["sources"][0]["title"], "Policy")
        history = self.client.get("/api/history?session_id=s1&limit=abc").get_json()["history"]
        self.assertEqual(len(history), 1)

    def test_text_file_upload_and_unsupported_type(self):
        self.register("upload_user")
        ok = self.client.post("/api/documents", data={"file": (io.BytesIO(b"hello world"), "notes.txt")})
        self.assertEqual(ok.get_json()["title"], "notes")
        bad = self.client.post("/api/documents", data={"file": (io.BytesIO(b"MZ"), "tool.exe")})
        self.assertEqual(bad.status_code, 400)

    def test_bad_pdf_with_path_in_name_is_rejected_safely(self):
        self.register("pdf_user")
        res = self.client.post("/api/documents", data={"file": (io.BytesIO(b"not a pdf"), "../../evil.pdf")})
        self.assertEqual(res.status_code, 400)
        self.assertEqual(list(app_module.UPLOAD_DIR.glob("*")), [])
        self.assertFalse(Path("../../evil.pdf").resolve().exists())

    def test_delete_other_users_document_is_404(self):
        self.register("owner")
        doc = self.client.post("/api/documents", data={"title": "Mine", "content": "text"}).get_json()
        self.client.post("/api/auth/logout")
        self.register("intruder")
        self.assertEqual(self.client.delete(f"/api/documents/{doc['id']}").status_code, 404)


if __name__ == "__main__":
    unittest.main()
