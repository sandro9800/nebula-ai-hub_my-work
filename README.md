# Nebula AI Hub — Sandro Iobidze

Personal learning hub: lecture code, homework, and side projects (Python first, AI projects next).

## Structure

```
nebula-ai-hub_sandro-iobidze/
├── README.md
├── .gitignore
├── requirements.txt
├── homeworks/          # assignments, one folder per homework (hw-01, hw-02, ...)
│   └── _template/
├── lectures/           # lecture code + notes, one folder per lecture (lecture-01, ...)
│   ├── _template/
│   └── lecture-01/
├── side-projects/      # personal projects, one folder per project
│   └── _project-template/
├── docs/               # roadmap, conventions, learning log
└── resources/          # cheatsheets, links, reference material
```

## Conventions

- Folder names: lowercase, zero-padded numbers, hyphens (`lecture-01`, `hw-03`, `my-project`).
- Python files: `snake_case.py`, simple flat scripts with short explanatory comments.
- Start new work by copying the matching `_template` folder.
- Never commit secrets (`.env`, API keys, real passwords).

## Run a script

```bash
python lectures/lecture-01/main_improved.py
```
