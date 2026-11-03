# Personal Expense Tracker

A beginner-friendly Python CLI app to record, list, delete, and summarize your personal spending. Data is saved to a local `expenses.json` file — no database or API key required.

## Features

- **Add** an expense with amount, category, description, and optional date
- **List** all expenses (newest first)
- **Delete** an expense by ID
- **Summary** of total spending and per-category breakdown
- **Filter** expenses by category and/or date range
- **Export** expenses to a CSV file
- Optional colorful output with the `rich` library
- Data persists in `expenses.json`

## Getting Started

### 1. Clone / open the folder
```bash
cd expense_tracker
```

### 2. Run the app
You only need Python 3.8+. No external packages required.

```bash
python tracker.py add 12.50 Food "Lunch with friend"
python tracker.py add 45.00 Transport "Weekly bus pass"
python tracker.py add 8.99 Coffee "Morning coffee"
```

### 3. List your expenses
```bash
python tracker.py list
```

Example output:
```
ID    Date        Category     Amount    Description
------------------------------------------------------------
ID 3  | 2026-11-03  | Coffee     | $8.99     | Morning coffee
ID 2  | 2026-11-03  | Transport  | $45.00    | Weekly bus pass
ID 1  | 2026-11-03  | Food       | $12.50    | Lunch with friend
```

### 4. See a summary
```bash
python tracker.py summary
```

### 5. Delete an expense
```bash
python tracker.py delete 2
```

## Commands

| Command | Usage | Description |
|---------|-------|-------------|
| `add` | `python tracker.py add <amount> <category> "<description>" [--date YYYY-MM-DD]` | Add a new expense |
| `list` | `python tracker.py list` | Show all expenses |
| `delete` | `python tracker.py delete <id>` | Remove an expense by ID |
| `summary` | `python tracker.py summary` | Show totals and category breakdown |
| `filter` | `python tracker.py filter [--category CAT] [--start YYYY-MM-DD] [--end YYYY-MM-DD]` | Show expenses matching filters |
| `export` | `python tracker.py export <file.csv>` | Export all expenses to CSV |

### Optional: colorful output

Install `rich` for prettier tables and colors:

```bash
pip install rich
```

The app detects `rich` automatically and uses it if available. It works fine without it too.

## Project Structure

```
expense_tracker/
├── tracker.py      # Main CLI application
├── README.md       # This file
└── expenses.json   # Auto-created data file (not committed)
```

## Ideas to Extend It

- Add a `filter` command to show expenses by category or date range
- Export data to CSV
- Add colors with the `rich` library
- Add unit tests with `pytest`
- Build a simple web interface with Flask or FastAPI

## License

MIT — feel free to use, modify, and share.