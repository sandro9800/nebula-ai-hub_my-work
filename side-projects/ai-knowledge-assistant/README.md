# Personal AI Knowledge Assistant (RAG)

A full-stack Retrieval-Augmented Generation (RAG) app with **user accounts**, **document chunking**, **PDF support**, **chat history**, and a **React + Tailwind** frontend.

Store text and PDF documents, then ask natural-language questions and get answers grounded in your documents — with sources cited.

---

## Features

| Feature | Description |
|---------|-------------|
| 🔐 **User Authentication** | Register, login, password hashing, per-user document isolation |
| 📄 **Document Upload** | Paste text or upload `.txt`, `.md`, `.pdf` files (up to 16 MB) |
| ✂️ **Smart Chunking** | Long documents are split into overlapping chunks for better retrieval |
| 🔍 **Semantic Search** | sentence-transformers embeddings + cosine similarity |
| 🤖 **Local LLM** | Ollama (e.g. `llama3.2`) — answers generated from your documents only |
| 📚 **Source Citations** | Every answer lists the document(s) it used |
| ⏱️ **Chat History** | Conversation history persisted per user & session |
| 🌐 **Full-Stack** | Flask REST API + React + Tailwind frontend + simple built-in page |
| 🐳 **Docker** | One-command start together with Ollama |

If Ollama is not running, the app still answers with the most relevant excerpt from your own documents.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Language | Python 3.11+, JavaScript (React 18) |
| Backend | Flask, Flask-CORS, gunicorn |
| Auth | Werkzeug password hashing, Flask sessions |
| Embeddings | sentence-transformers (`all-MiniLM-L6-v2`) |
| Similarity | NumPy (cosine similarity) |
| Database | SQLite (users, documents, chunks, conversations) |
| PDF parsing | pypdf |
| LLM | Ollama (local) |
| Frontend | React, Tailwind CSS, Vite |
| Container | Docker, Docker Compose |

---

## Project Structure

```
ai-knowledge-assistant/
├── kb.py                # Core RAG: auth, chunking, embedding, search, LLM, CLI
├── app.py               # Flask backend + REST API (auth-protected)
├── test_app.py          # Tests (uses a fake embedding model, runs in seconds)
├── Dockerfile           # Container image
├── docker-compose.yml   # Backend + Ollama
├── requirements.txt     # Python dependencies
├── LICENSE.txt
├── README.md            # This file
├── templates/
│   └── index.html       # Simple built-in page (login, add documents, ask)
└── frontend/            # React + Tailwind frontend
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── index.css
        ├── App.jsx
        └── components/
            ├── Login.jsx
            ├── Register.jsx
            ├── DocumentUpload.jsx
            ├── DocumentList.jsx
            ├── ChatInterface.jsx
            └── HistoryList.jsx
```

The SQLite database (`knowledge.db`) is created automatically on first run and is not committed.

---

## Quick Start — Local Development

### 1. Install Python dependencies
```bash
cd side-projects/ai-knowledge-assistant
pip install -r requirements.txt
```

### 2. Run Ollama (local LLM)
Install [Ollama](https://ollama.com), then pull a model:
```bash
ollama pull llama3.2
# Keep Ollama running in the background
```

### 3. Start the backend
```bash
python app.py
# API and built-in page: http://localhost:5000
```

### 4. Start the React frontend (separate terminal)
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173  (it forwards /api to the backend on port 5000)
```

### 5. Or use the CLI
```bash
python kb.py
# Commands: register, login, add, pdf, ask, list, history, quit
```

### Run the tests
```bash
pip install -r requirements.txt
python -m unittest -v
```

---

## Docker

```bash
docker compose up --build
```

This starts **Ollama** (port 11434) and the **backend** (port 5000). Open `http://localhost:5000` for the built-in page. The React frontend is run separately with `npm run dev` (see above).

Pull the LLM model once:
```bash
docker compose exec ollama ollama pull llama3.2
```

The database is kept in a Docker volume (`kb_data`), so it survives restarts. Stop everything with:
```bash
docker compose down
```

Set your own secret before real use: create a `.env` file next to `docker-compose.yml`:
```bash
echo "SECRET_KEY=$(openssl rand -hex 32)" > .env
```

---

## Configuration

All settings are environment variables.

| Variable | Default | Meaning |
|----------|---------|---------|
| `SECRET_KEY` | dev placeholder (a warning is printed) | Signs the login cookie. **Set it in production.** |
| `OLLAMA_URL` | `http://localhost:11434/api/generate` | Where Ollama listens |
| `OLLAMA_MODEL` | `llama3.2` | Model used for answers |
| `KNOWLEDGE_DB` | `knowledge.db` | Path of the SQLite file |
| `CORS_ORIGINS` | `http://localhost:5173` | Comma-separated origins allowed to call the API with cookies |
| `HOST` | `127.0.0.1` | Address `python app.py` listens on |
| `PORT` | `5000` | Port |
| `FLASK_DEBUG` | off | Set to `1` for debug mode (never on a public server) |

---

## Deployment notes

- **Backend** (Render, Railway, a VPS): build with `pip install -r requirements.txt` and start with
  `gunicorn -w 1 --threads 4 --timeout 120 -b 0.0.0.0:$PORT app:app`.
  Set `SECRET_KEY`, `OLLAMA_URL` and `OLLAMA_MODEL`. To keep the database, mount a disk (for example at `/data`) and set `KNOWLEDGE_DB=/data/knowledge.db`. With the included `Dockerfile` this is already done.
- **Ollama** needs a machine with enough memory (ideally a GPU). Run it on its own server or service and point `OLLAMA_URL` at it.
- **Frontend:** the React app calls relative `/api/...` URLs, so it must be served from the same domain as the backend or behind a proxy/rewrite to it. If you only need a simple UI, use the built-in page that the backend serves at `/`.

---

## API Reference

All endpoints need the login session cookie unless noted.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | `{ "username", "password" }` (password at least 6 characters) |
| `/api/auth/login` | POST | `{ "username", "password" }` |
| `/api/auth/logout` | POST | Clear session |
| `/api/auth/me` | GET | Check auth status |
| `/api/documents` | GET | List user's documents |
| `/api/documents` | POST | Add document (form: `title`, `content`, or `file`) |
| `/api/documents/<id>` | DELETE | Delete owned document |
| `/api/ask` | POST | `{ "query", "session_id" }` |
| `/api/history` | GET | `?session_id=...&limit=20` |

### Example: log in and ask with curl
```bash
curl -c cookies.txt -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"sandro","password":"mypassword"}'

curl -b cookies.txt -X POST http://localhost:5000/api/ask \
  -H "Content-Type: application/json" \
  -d '{"query":"What is the vacation policy?","session_id":"user-123"}'
```

---

## Example Usage

**Web UI:**
1. Register / Login at `http://localhost:5173` (React) or `http://localhost:5000` (built-in page)
2. Add a document titled "Company Policy" (paste text or upload a PDF)
3. Ask: "What is the vacation policy?"
4. Receive an answer with source citations like `[1] Company Policy`

**CLI** (quote titles that contain spaces):
```bash
> register sandro mypassword
User created with id 1
> login sandro mypassword
Logged in as user #1
> add "Meeting Notes" notes.txt
Added document #1: Meeting Notes
> pdf "Employee Handbook" handbook.pdf
Added PDF document #2: Employee Handbook
> ask What was decided about the budget?
[Answer with citations]
Sources:
  - [1] Meeting Notes
> history
```

---

## Known limitations

- Search compares the question with every stored chunk, which is fine for personal use but slow for very large collections.
- Only text-based PDFs work (scanned images have no text to extract).
- No rate limiting and no password reset.

## Extending It

- **Swap the LLM** — change `OLLAMA_MODEL` or use the OpenAI/Anthropic API in `kb.py`
- **Real vector DB** — replace NumPy search with Chroma, pgvector, or Pinecone
- **PDF chunking by pages** — chunks are character based now; page-aware splits would be better
- **Document editing** — add a PUT endpoint to update document content
- **Rate limiting** — add Flask-Limiter for API protection

---

## License

MIT
