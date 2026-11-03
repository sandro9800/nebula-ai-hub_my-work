# Personal Expense Tracker

A beginner-friendly Python CLI app to record, list, delete, filter, summarize and export your personal spending. Data is saved to a local `expenses.json` file — no database or API key required.

## Features

- **Add** an expense with amount, category, description, and optional date
- **List** all expenses (newest first)
- **Delete** an expense by ID
- **Summary** of total spending and per-category breakdown
- **Filter** expenses by category and/or date range
- **Export** expenses to a CSV file
- Input checks: the amount must be a positive number, category and description cannot be empty, dates must be real `YYYY-MM-DD` dates
- If `expenses.json` ever gets damaged, it is kept as `expenses.json.bak` instead of being overwritten
- Optional colorful output with the `rich` library

## Getting Started

### 1. Open the folder
```bash
cd side-projects/expense-tracker
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

Example output (plain text, without `rich`):
```
All Expenses
ID   Date        Category      Amount    Description
------------------------------------------------------------
  ID 1   | 2026-11-03 | Food         | $12.50    | Lunch with friend
  ID 2   | 2026-11-03 | Transport    | $45.00    | Weekly bus pass
  ID 3   | 2026-11-03 | Coffee       | $8.99     | Morning coffee
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

## Tests

```bash
python test_tracker.py
```

or, if you have `pytest` installed, just `pytest`.

## Project Structure

```
expense-tracker/
├── tracker.py        # The CLI application
├── test_tracker.py   # Tests
├── expenses.json     # Data file, created on the first `add` (this copy is sample data)
├── expenses.csv      # Sample CSV export
├── my_spending.csv   # Sample CSV export
├── LICENSE.txt
└── README.md         # This file
```

The data file always lives next to `tracker.py`, so the commands work from any folder.

## Ideas to Extend It

- Edit an existing expense
- Monthly report and spending per month
- Budgets per category with a warning when you go over
- Import from a CSV file
- Build a simple web interface with Flask or FastAPI

## License

MIT — feel free to use, modify, and share.
