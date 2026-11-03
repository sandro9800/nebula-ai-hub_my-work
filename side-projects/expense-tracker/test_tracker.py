"""Basic tests for the ExpenseTracker.

Run with:  python test_tracker.py   (or: pytest)
"""

import tempfile
from pathlib import Path

from tracker import ExpenseTracker


def expect_value_error(function, *args, **kwargs):
    try:
        function(*args, **kwargs)
    except ValueError:
        return
    raise AssertionError("Expected ValueError")


def test_add_and_list():
    with tempfile.TemporaryDirectory() as tmp:
        tracker = ExpenseTracker(Path(tmp) / "expenses.json")
        tracker.add(10.00, "Food", "Sandwich", date="2026-01-01")
        tracker.add(5.50, "Transport", "Bus", date="2026-01-02")

        expenses = tracker.list_all()
        assert len(expenses) == 2
        amounts = {e["amount"] for e in expenses}
        assert amounts == {10.00, 5.50}


def test_delete():
    with tempfile.TemporaryDirectory() as tmp:
        tracker = ExpenseTracker(Path(tmp) / "expenses.json")
        tracker.add(10.00, "Food", "Sandwich", date="2026-01-01")
        tracker.add(20.00, "Food", "Pizza", date="2026-01-01")

        assert tracker.delete(1) is True
        assert tracker.delete(999) is False
        assert len(tracker.list_all()) == 1


def test_summary():
    with tempfile.TemporaryDirectory() as tmp:
        tracker = ExpenseTracker(Path(tmp) / "expenses.json")
        tracker.add(10.00, "Food", "Sandwich", date="2026-01-01")
        tracker.add(20.00, "Food", "Pizza", date="2026-01-01")
        tracker.add(5.00, "Transport", "Bus", date="2026-01-01")

        summary = tracker.summary()
        assert summary["total"] == 35.00
        assert summary["count"] == 3
        assert summary["by_category"]["Food"] == 30.00
        assert summary["by_category"]["Transport"] == 5.00


def test_amount_must_be_positive():
    with tempfile.TemporaryDirectory() as tmp:
        tracker = ExpenseTracker(Path(tmp) / "expenses.json")
        expect_value_error(tracker.add, -5.00, "Food", "Bad", date="2026-01-01")
        expect_value_error(tracker.add, 0, "Food", "Bad", date="2026-01-01")
        expect_value_error(tracker.add, float("nan"), "Food", "Bad", date="2026-01-01")
        expect_value_error(tracker.add, float("inf"), "Food", "Bad", date="2026-01-01")
        expect_value_error(tracker.add, 0.001, "Food", "Rounds to zero", date="2026-01-01")
        assert len(tracker.list_all()) == 0


def test_text_fields_and_date_are_checked():
    with tempfile.TemporaryDirectory() as tmp:
        tracker = ExpenseTracker(Path(tmp) / "expenses.json")
        expect_value_error(tracker.add, 5, "  ", "No category")
        expect_value_error(tracker.add, 5, "Food", "   ")
        expect_value_error(tracker.add, 5, "Food", "Bad date", date="banana")
        expect_value_error(tracker.add, 5, "Food", "Impossible date", date="2026-02-31")
        assert tracker.list_all() == []

        expense = tracker.add(5, "Food", "Good date", date="2026-02-01")
        assert expense["date"] == "2026-02-01"


def test_filter_by_category_and_dates():
    with tempfile.TemporaryDirectory() as tmp:
        tracker = ExpenseTracker(Path(tmp) / "expenses.json")
        tracker.add(1, "Food", "a", date="2026-01-01")
        tracker.add(2, "Food", "b", date="2026-02-01")
        tracker.add(3, "Coffee", "c", date="2026-03-01")

        assert [e["description"] for e in tracker.filter_expenses(category="food")] == ["b", "a"]
        assert [e["description"] for e in tracker.filter_expenses(start_date="2026-02-01")] == ["c", "b"]
        assert [e["description"] for e in tracker.filter_expenses(end_date="2026-01-31")] == ["a"]
        expect_value_error(tracker.filter_expenses, start_date="not-a-date")


def test_unreadable_file_is_kept_as_backup():
    with tempfile.TemporaryDirectory() as tmp:
        data_file = Path(tmp) / "expenses.json"
        data_file.write_text("{ this is not json", encoding="utf-8")

        tracker = ExpenseTracker(data_file)
        assert tracker.list_all() == []
        tracker.add(5, "Food", "New", date="2026-01-01")

        backup = Path(tmp) / "expenses.json.bak"
        assert backup.read_text(encoding="utf-8") == "{ this is not json"


def test_export_csv():
    with tempfile.TemporaryDirectory() as tmp:
        tracker = ExpenseTracker(Path(tmp) / "expenses.json")
        tracker.add(1.5, "Food", "a", date="2026-01-01")
        out = Path(tmp) / "out.csv"
        assert tracker.export_csv(out) == 1
        lines = out.read_text(encoding="utf-8").splitlines()
        assert lines[0] == "id,date,category,amount,description"
        assert lines[1] == "1,2026-01-01,Food,1.5,a"


if __name__ == "__main__":
    test_add_and_list()
    test_delete()
    test_summary()
    test_amount_must_be_positive()
    test_text_fields_and_date_are_checked()
    test_filter_by_category_and_dates()
    test_unreadable_file_is_kept_as_backup()
    test_export_csv()
    print("All tests passed!")
