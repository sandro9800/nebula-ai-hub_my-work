# Nebula AI Hub — Sandro Iobidze

Personal learning hub: lecture code, homework, and side projects (Python first, AI projects next).

## Side projects

| Project | What it is |
|---------|------------|
| [`premiummchub`](side-projects/premiummchub) | Catalog of Minecraft clients, mods and macros with an admin panel (React, Vite, Vercel) |
| [`py-bank`](side-projects/py-bank) | Command-line bank system with SQLite and tests |
| [`ai-knowledge-assistant`](side-projects/ai-knowledge-assistant) | RAG assistant: upload documents, ask questions, get answers with sources (Flask, React, Ollama) |
| [`expense-tracker`](side-projects/expense-tracker) | Command-line expense tracker with filters, summary and CSV export |

## Structure

```
nebula-ai-hub_my-work/
├── README.md
├── .gitignore
├── requirements.txt
├── homeworks/          # assignments, one folder per homework (hw-01, hw-02, ...)
│   ├── README.md       # table of all homeworks
│   ├── _template/
│   └── hw-01/
├── lectures/           # lecture code + notes, one folder per lecture
│   ├── README.md       # table of all lectures
│   ├── _template/
│   ├── lecture-01/
│   └── lecture-02/
├── side-projects/      # personal projects, one folder per project
│   ├── README.md       # table of all projects
│   ├── _project-template/
│   ├── premiummchub/
│   ├── py-bank/
│   ├── ai-knowledge-assistant/
│   └── expense-tracker/
├── docs/               # roadmap, conventions, learning log, weekly check rules
└── resources/          # cheatsheets, links, reference material
```

## Conventions

- Folder names: lowercase, zero-padded numbers, hyphens (`lecture-01`, `hw-03`, `my-project`).
- Python files: `snake_case.py`, simple flat scripts with short explanatory comments.
- Start new work by copying the matching `_template` folder.
- Every new lecture, homework or side project gets a row in the table of its folder's `README.md`.
- Never commit secrets (`.env`, API keys, real passwords).

See [`docs/conventions.md`](docs/conventions.md) for the full list.
