"""Basic tests for the ExpenseTracker."""

import os
import tempfile
from pathlib import Path

from tracker import ExpenseTracker


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
        try:
            tracker.add(-5.00, "Food", "Bad", date="2026-01-01")
        except ValueError:
            pass
        else:
            raise AssertionError("Expected ValueError for negative amount")

        assert len(tracker.list_all()) == 0


if __name__ == "__main__":
    test_add_and_list()
    test_delete()
    test_summary()
    test_amount_must_be_positive()
    print("All tests passed!")
