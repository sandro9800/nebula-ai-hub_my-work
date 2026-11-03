# Personal AI Knowledge Assistant (RAG)

A production-ready Retrieval-Augmented Generation (RAG) app with **user authentication**, **document chunking**, **PDF support**, **chat history**, and a **React + Tailwind** frontend.

Store text and PDF documents, then ask natural-language questions and get answers grounded in your documents — with sources cited.

---

## Features

| Feature | Description |
|---------|-------------|
| 🔐 **User Authentication** | Register, login, password hashing, per-user document isolation |
| 📄 **Document Upload** | Paste text or upload `.txt`, `.md`, `.pdf` files |
| ✂️ **Smart Chunking** | Long documents are split into overlapping chunks for better retrieval |
| 🔍 **Semantic Search** | sentence-transformers embeddings + cosine similarity |
| 🤖 **Local LLM** | Ollama (e.g. `llama3.2`) — answers generated from your documents only |
| 📚 **Source Citations** | Every answer cites the document(s) it used |
| ⏱️ **Chat History** | Conversation history persisted per user & session |
| 🌐 **Full-Stack** | Flask REST API + React + Tailwind frontend |
| 🐳 **Docker** | One-command deployment with Ollama |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Language | Python 3.11, JavaScript (React 18) |
| Backend | Flask, Flask-CORS |
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
ai_knowledge_assistant/
├── kb.py                # Core RAG: auth, chunking, embedding, search, LLM
├── app.py               # Flask backend + REST API (auth-protected)
├── Dockerfile           # Production container image
├── docker-compose.yml   # Backend + Ollama orchestration
├── requirements.txt     # Python dependencies
├── .gitignore
├── README.md            # This file
├── knowledge.db         # Auto-created SQLite database
├── templates/
│   └── index.html       # Simple Flask fallback UI
└── frontend/            # React + Tailwind frontend
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    ├── .gitignore
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

---

## Quick Start — Local Development

### 1. Install Python dependencies
```bash
cd ai_knowledge_assistant
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
# API runs at http://localhost:5000
```

### 4. Start the frontend (separate terminal)
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

### 5. Or use the CLI
```bash
python kb.py
# Commands: register, login, add, pdf, ask, list, history, quit
```

---

## Docker Deployment (Recommended)

### One-command start
```bash
docker compose up --build
```

This starts **Ollama** (port 11434) and **Backend API** (port 5000).

### Pull the LLM model inside the container
```bash
docker exec -it ai_knowledge_assistant_ollama_1 ollama pull llama3.2
```

### Stop
```bash
docker compose down
```

---

## Deployment Guides

### Option A: Render (Backend + Ollama separately)

Render doesn't easily run Ollama, so deploy Ollama on a separate VM or use a GPU service, then point the backend at it.

#### 1. Backend on Render
1. Push this repo to GitHub.
2. In Render, create a **Web Service** from your repo.
3. Set these environment variables:
   - `OLLAMA_URL` → `https://your-ollama-instance.com/api/generate`
   - `OLLAMA_MODEL` → `llama3.2`
   - `SECRET_KEY` → a random secure string
4. Build command: `pip install -r requirements.txt`
5. Start command: `gunicorn -w 4 -k gthread app:app` (or `python app.py`)
6. Add a **Disk** mounted at `/app` if you want `knowledge.db` to persist.

#### 2. Ollama (separate)
Run Ollama on a GPU-capable VM (e.g., RunPod, Lambda Labs, or a dedicated server) and expose port 11434 publicly (with authentication if needed).

#### 3. Frontend
Build the React app:
```bash
cd frontend
npm install
npm run build
```
Deploy the `dist/` folder to Vercel, Netlify, or GitHub Pages. Set the API base URL to your Render backend.

---

### Option B: Railway

Railway makes it easy to deploy both services.

#### 1. Backend
1. Connect your GitHub repo to Railway.
2. Add a **Dockerfile** service pointing at `Dockerfile`.
3. Add environment variables:
   - `OLLAMA_URL` → your Ollama endpoint
   - `OLLAMA_MODEL` → `llama3.2`
   - `SECRET_KEY` → random string
4. Railway will auto-detect the port from `EXPOSE 5000`.

#### 2. Ollama
Add an Ollama service from the Railway template or deploy `ollama/ollama` as a Docker service.

#### 3. Frontend
Deploy the `frontend/` folder as a static site or Vite build on Railway/Vercel.

---

### Option C: Docker Compose on a VPS (DigitalOcean, Hetzner, AWS EC2)

```bash
# On your server
git clone <your-repo>
cd ai_knowledge_assistant

# Create .env
echo "SECRET_KEY=$(openssl rand -hex 32)" > .env
echo "OLLAMA_URL=http://localhost:11434/api/generate" >> .env
echo "OLLAMA_MODEL=llama3.2" >> .env

# Start
docker compose up -d --build

# Pull model
docker exec -it <ollama_container> ollama pull llama3.2
```

---

## API Reference

All endpoints require authentication (session cookie) unless noted.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | `{ "username", "password" }` |
| `/api/auth/login` | POST | `{ "username", "password" }` |
| `/api/auth/logout` | POST | Clear session |
| `/api/auth/me` | GET | Check auth status |
| `/api/documents` | GET | List user's documents |
| `/api/documents` | POST | Add document (form: `title`, `content`, or `file`) |
| `/api/documents/<id>` | DELETE | Delete owned document |
| `/api/ask` | POST | `{ "query", "session_id" }` |
| `/api/history` | GET | `?session_id=...&limit=20` |

### Example: Ask via curl
```bash
curl -X POST http://localhost:5000/api/ask \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"query":"What is the vacation policy?","session_id":"user-123"}'
```

---

## Example Usage

**Web UI:**
1. Register / Login at `http://localhost:5173`
2. Add a document titled "Company Policy" (paste text or upload PDF)
3. Ask: "What is the vacation policy?"
4. Receive an answer with source citations like `[1] Company Policy`

**CLI:**
```bash
> register sandro mypassword
User created with id 1
> login sandro mypassword
Logged in as user #1
> add "Meeting Notes" notes.txt
Added document #1: Meeting Notes
> pdf "Employee Handbook" handbook.pdf
Added PDF document #2: Employee Handbook
> ask "What was decided about the budget?"
[Answer with citations]
Sources:
  - [1] Meeting Notes
> history
```

---

## Extending It

- **Swap the LLM** — change `OLLAMA_MODEL` or use OpenAI/Anthropic API in `kb.py`
- **Real vector DB** — replace NumPy search with Chroma, pgvector, or Pinecone
- **PDF chunking by pages** — already chunked by character; can be improved with page-aware splits
- **Document editing** — add PUT endpoint to update document content
- **User roles** — add admin role for global document management
- **Rate limiting** — add Flask-Limiter for API protection

---

## License

MIT