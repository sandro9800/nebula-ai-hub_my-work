# Conventions

- Folders: lowercase-with-hyphens, numbered with two digits (`lecture-01`). Side projects use lowercase-with-hyphens too (`expense-tracker`, not `expense_tracker`).
- Python: snake_case, simple flat scripts with short explanatory comments (no unnecessary functions).
- Commits: short imperative messages (`add lecture-02 notes`).
- Secrets go in `.env` (git-ignored), never in code.
- Topics: every new lecture must get a row (number, topic, status) in the table in `lectures/README.md`. Every new homework must get a row in `homeworks/README.md`. Every new side project must get a row (project, idea, status) in `side-projects/README.md`.
- Never commit generated files (`__pycache__/`, `*.pyc`); they are listed in `.gitignore`.
