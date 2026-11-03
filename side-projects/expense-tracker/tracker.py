"""Personal Expense Tracker - a simple CLI app to track your spending."""

from __future__ import annotations

import argparse
import csv
import json
import math
import sys
from datetime import datetime
from pathlib import Path
from typing import List, Optional

# next to tracker.py, so the data is found no matter where the command is run from
DATA_FILE = Path(__file__).resolve().with_name("expenses.json")

# Try to import rich for nicer output; fall back to plain text if not installed.
try:
    from rich.console import Console
    from rich.markup import escape
    from rich.table import Table

    _console = Console()
    HAS_RICH = True
except ImportError:  # pragma: no cover - depends on user environment
    _console = None  # type: ignore
    HAS_RICH = False

    def escape(text: str) -> str:  # type: ignore
        return text


def _validate_date(value: str) -> str:
    """Return the date if it is a real YYYY-MM-DD date, otherwise raise ValueError."""
    try:
        return datetime.strptime(value.strip(), "%Y-%m-%d").strftime("%Y-%m-%d")
    except ValueError:
        raise ValueError("Date must be a real date in YYYY-MM-DD format.") from None


class ExpenseTracker:
    """Handles loading, saving, adding, deleting, filtering, and exporting expenses."""

    def __init__(self, data_file: Path = DATA_FILE) -> None:
        self.data_file = data_file
        self.expenses: List[dict] = self._load()

    def _load(self) -> List[dict]:
        """Load expenses from the JSON file."""
        if not self.data_file.exists():
            return []
        try:
            with open(self.data_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            return data if isinstance(data, list) else []
        except (json.JSONDecodeError, OSError):
            # keep the unreadable file instead of overwriting it with an empty list later
            backup = self.data_file.with_name(self.data_file.name + ".bak")
            try:
                self.data_file.replace(backup)
                print(f"Warning: could not read {self.data_file.name}. Saved it as {backup.name} and started fresh.")
            except OSError:
                print(f"Warning: could not read {self.data_file.name}. Starting fresh.")
            return []

    def _save(self) -> None:
        """Save expenses to the JSON file."""
        with open(self.data_file, "w", encoding="utf-8") as f:
            json.dump(self.expenses, f, indent=2)

    def _next_id(self) -> int:
        if not self.expenses:
            return 1
        return max(int(e.get("id", 0)) for e in self.expenses) + 1

    def add(
        self,
        amount: float,
        category: str,
        description: str,
        date: Optional[str] = None,
    ) -> dict:
        """Add a new expense and return it."""
        try:
            amount = round(float(amount), 2)
        except (TypeError, ValueError):
            raise ValueError("Amount must be a number.") from None
        if not math.isfinite(amount) or amount <= 0:
            raise ValueError("Amount must be greater than zero.")

        category = category.strip()
        description = description.strip()
        if not category:
            raise ValueError("Category cannot be empty.")
        if not description:
            raise ValueError("Description cannot be empty.")

        expense = {
            "id": self._next_id(),
            "amount": amount,
            "category": category,
            "description": description,
            "date": _validate_date(date) if date else datetime.now().strftime("%Y-%m-%d"),
        }
        self.expenses.append(expense)
        self._save()
        return expense

    def list_all(self) -> List[dict]:
        """Return all expenses sorted by date (newest first)."""
        return sorted(self.expenses, key=lambda e: e.get("date", ""), reverse=True)

    def delete(self, expense_id: int) -> bool:
        """Delete an expense by ID. Returns True if deleted."""
        for i, expense in enumerate(self.expenses):
            if int(expense.get("id", 0)) == expense_id:
                self.expenses.pop(i)
                self._save()
                return True
        return False

    def summary(self) -> dict:
        """Return total spending and per-category breakdown."""
        total = round(sum(float(e.get("amount", 0)) for e in self.expenses), 2)
        by_category: dict[str, float] = {}
        for e in self.expenses:
            cat = e.get("category", "Uncategorized")
            by_category[cat] = round(by_category.get(cat, 0) + float(e.get("amount", 0)), 2)
        return {"total": total, "count": len(self.expenses), "by_category": by_category}

    def filter_expenses(
        self,
        category: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
    ) -> List[dict]:
        """Return expenses matching the given filters."""
        if start_date:
            start_date = _validate_date(start_date)
        if end_date:
            end_date = _validate_date(end_date)
        results = []
        for e in self.expenses:
            if category and e.get("category", "").lower() != category.lower():
                continue
            if start_date and e.get("date", "") < start_date:
                continue
            if end_date and e.get("date", "") > end_date:
                continue
            results.append(e)
        return sorted(results, key=lambda e: e.get("date", ""), reverse=True)

    def export_csv(self, filename: Path) -> int:
        """Export expenses to a CSV file. Returns the number of rows written."""
        fieldnames = ["id", "date", "category", "amount", "description"]
        with open(filename, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            count = 0
            for e in self.list_all():
                writer.writerow({key: e.get(key, "") for key in fieldnames})
                count += 1
        return count


def _print_expense(e: dict) -> None:
    """Print a single expense using rich if available, otherwise plain text."""
    if HAS_RICH and _console is not None:
        _console.print(
            f"[cyan]ID {e.get('id')}[/cyan] | "
            f"[green]{escape(str(e.get('date')))}[/green] | "
            f"[magenta]{escape(str(e.get('category')))}[/magenta] | "
            f"[yellow]${float(e.get('amount', 0)):.2f}[/yellow] | "
            f"{escape(str(e.get('description')))}"
        )
    else:
        print(
            f"  ID {str(e.get('id')):<3} | {str(e.get('date')):<10} | "
            f"{str(e.get('category')):<12} | ${float(e.get('amount', 0)):<8.2f} | {e.get('description')}"
        )


def _print_table(title: str, expenses: List[dict]) -> None:
    """Print a list of expenses as a table."""
    if not expenses:
        print("No expenses found.")
        return

    if HAS_RICH and _console is not None:
        table = Table(title=title)
        table.add_column("ID", style="cyan", justify="right")
        table.add_column("Date", style="green")
        table.add_column("Category", style="magenta")
        table.add_column("Amount", style="yellow", justify="right")
        table.add_column("Description", style="white")

        for e in expenses:
            table.add_row(
                str(e.get("id", "")),
                escape(str(e.get("date", ""))),
                escape(str(e.get("category", ""))),
                f"${float(e.get('amount', 0)):.2f}",
                escape(str(e.get("description", ""))),
            )
        _console.print(table)
    else:
        print(f"\n{title}")
        print(f"{'ID':<4} {'Date':<11} {'Category':<13} {'Amount':<9} Description")
        print("-" * 60)
        for e in expenses:
            _print_expense(e)


def cmd_add(args: argparse.Namespace, tracker: ExpenseTracker) -> None:
    try:
        expense = tracker.add(
            amount=args.amount,
            category=args.category,
            description=args.description,
            date=args.date,
        )
        print("Expense added:")
        _print_expense(expense)
    except ValueError as exc:
        print(f"Error: {exc}")
        sys.exit(1)


def cmd_list(args: argparse.Namespace, tracker: ExpenseTracker) -> None:
    expenses = tracker.list_all()
    _print_table("All Expenses", expenses)


def cmd_delete(args: argparse.Namespace, tracker: ExpenseTracker) -> None:
    if tracker.delete(args.id):
        print(f"Deleted expense ID {args.id}.")
    else:
        print(f"No expense found with ID {args.id}.")


def cmd_summary(args: argparse.Namespace, tracker: ExpenseTracker) -> None:
    summary = tracker.summary()
    print(f"Total expenses: {summary['count']}")
    print(f"Total spent:    ${summary['total']:.2f}")
    if summary["by_category"]:
        print("\nBy category:")
        for cat, amount in sorted(
            summary["by_category"].items(), key=lambda x: x[1], reverse=True
        ):
            print(f"  {cat:<15} ${amount:.2f}")


def cmd_filter(args: argparse.Namespace, tracker: ExpenseTracker) -> None:
    try:
        expenses = tracker.filter_expenses(
            category=args.category,
            start_date=args.start,
            end_date=args.end,
        )
    except ValueError as exc:
        print(f"Error: {exc}")
        sys.exit(1)
    _print_table("Filtered Expenses", expenses)


def cmd_export(args: argparse.Namespace, tracker: ExpenseTracker) -> None:
    try:
        count = tracker.export_csv(Path(args.file))
    except OSError as exc:
        print(f"Error: could not write {args.file}: {exc.strerror or exc}")
        sys.exit(1)
    print(f"Exported {count} expense(s) to {args.file}")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Personal Expense Tracker - track your spending from the command line."
    )
    sub = parser.add_subparsers(dest="command", required=True)

    # add
    add_p = sub.add_parser("add", help="Add a new expense")
    add_p.add_argument("amount", type=float, help="Amount spent (e.g. 12.50)")
    add_p.add_argument("category", help="Category (e.g. Food, Transport)")
    add_p.add_argument("description", help="Short description")
    add_p.add_argument("--date", help="Date in YYYY-MM-DD format (defaults to today)")
    add_p.set_defaults(func=cmd_add)

    # list
    list_p = sub.add_parser("list", help="List all expenses")
    list_p.set_defaults(func=cmd_list)

    # delete
    del_p = sub.add_parser("delete", help="Delete an expense by ID")
    del_p.add_argument("id", type=int, help="Expense ID to delete")
    del_p.set_defaults(func=cmd_delete)

    # summary
    sum_p = sub.add_parser("summary", help="Show spending summary")
    sum_p.set_defaults(func=cmd_summary)

    # filter
    filter_p = sub.add_parser("filter", help="Filter expenses by category and/or date")
    filter_p.add_argument("--category", help="Filter by category name")
    filter_p.add_argument("--start", help="Start date (YYYY-MM-DD), inclusive")
    filter_p.add_argument("--end", help="End date (YYYY-MM-DD), inclusive")
    filter_p.set_defaults(func=cmd_filter)

    # export
    export_p = sub.add_parser("export", help="Export expenses to a CSV file")
    export_p.add_argument("file", help="Output CSV filename (e.g. expenses.csv)")
    export_p.set_defaults(func=cmd_export)

    return parser


def main(argv: Optional[List[str]] = None) -> None:
    parser = build_parser()
    args = parser.parse_args(argv)
    tracker = ExpenseTracker()
    args.func(args, tracker)


if __name__ == "__main__":
    main()
