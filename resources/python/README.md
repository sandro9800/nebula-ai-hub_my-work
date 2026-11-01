# Python guide

This guide follows the learning roadmap in `docs/roadmap.md`. For each topic: what to learn, a tiny example, practice ideas, and where to read more. Code style follows `docs/conventions.md`: snake_case names and simple flat scripts with short comments.

## Books in this folder

- `Python for Everybody Exploring Data Using Python 3.pdf` — beginner-friendly, covers everything up to databases and web data (the same book as the free course at https://www.py4e.com)
- `Introduction to Programming Using Python - 2013.docx` — a university-style introduction with exercises

## How to learn (the method that works)

1. Read or watch a small piece of theory (15–20 min).
2. Type the examples yourself. Do not copy-paste.
3. Change them and break them on purpose. Read the error message.
4. Build a tiny program that uses the idea.
5. Commit it with a short message and write one line in `docs/learning-log.md`.

Study a little every day. 30 minutes daily beats 5 hours once a week.

## Setup

```
python --version                  # check it is Python 3
python main.py                    # run a script
python -m venv .venv              # make a virtual environment (once per project)
source .venv/bin/activate         # activate it (Windows: .venv\Scripts\activate)
pip install requests python-dotenv
pip freeze > requirements.txt     # save the packages you use
pip install -r requirements.txt   # install them on another computer
```

Put `.venv/` and `.env` in `.gitignore`.

## 1. Basics (done ✔)

Variables, `input()`, conditions, loops.

```python
name = input('Name: ')
age = int(input('Age: '))      # input() always gives text, so convert it
if age >= 18:
    print(name, 'is an adult')
else:
    print(name, 'is a minor')

for i in range(1, 6):
    print(i)
```

Practice: guess-the-number game, multiplication table, FizzBuzz, simple calculator.

Common bug: comparing text to a number (`'5' > 3` fails). Convert with `int()` or `float()`.

## 2. Functions and modules

A function is a named block of code you can reuse.

```python
def add(a, b):
    return a + b

print(add(2, 3))
```

A module is just a `.py` file you import:

```python
import math
from random import randint

print(math.sqrt(16), randint(1, 10))
```

Practice: temperature converter, password generator, your own `helpers.py` that you import in another file.
Read: https://docs.python.org/3/tutorial/controlflow.html#defining-functions and https://docs.python.org/3/tutorial/modules.html

Note: your lecture scripts stay flat (no `def`) per the conventions. Functions are for when you reach this topic in side-projects.

## 3. Lists, dicts, sets

```python
fruits = ['apple', 'pear']       # list: ordered, changeable
fruits.append('plum')

person = {'name': 'Nino', 'age': 20}   # dict: key -> value
print(person['name'])

unique = set([1, 2, 2, 3])       # set: no duplicates -> {1, 2, 3}

squares = [n * n for n in range(5)]    # list comprehension
```

Practice: to-do list in the terminal, word counter (dict), remove duplicates (set), phone book.
Read: https://docs.python.org/3/tutorial/datastructures.html

## 4. File I/O and error handling

```python
with open('notes.txt', 'w') as f:        # 'w' write, 'a' append, 'r' read
    f.write('hello\n')

with open('notes.txt') as f:
    for line in f:
        print(line.strip())

try:
    n = int(input('Number: '))
except ValueError:
    print('That is not a number')
```

Also learn `json` to save dicts: `json.dump(data, f)` and `json.load(f)`.
Practice: save your to-do list to a file, a diary program, read a CSV and print totals.
Read: https://docs.python.org/3/tutorial/inputoutput.html and https://docs.python.org/3/tutorial/errors.html

## 5. OOP (classes)

```python
class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount

acc = Account('Sandro')
acc.deposit(50)
print(acc.balance)
```

Idea: a class bundles data (attributes) and actions (methods). Your `py-bank` side-project is a good place to study this.
Practice: `Student` class, `Book`/`Library`, a small game with `Player` and `Enemy`.
Read: https://docs.python.org/3/tutorial/classes.html

## 6. SQLite and databases

```python
import sqlite3

conn = sqlite3.connect('app.db')
cur = conn.cursor()
cur.execute('CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, text TEXT)')
cur.execute('INSERT INTO notes (text) VALUES (?)', ('first note',))   # always use ? placeholders
conn.commit()
for row in cur.execute('SELECT * FROM notes'):
    print(row)
conn.close()
```

Important: never build SQL by joining strings with user input. Use `?` placeholders (prevents SQL injection).
Learn basic SQL too: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `WHERE`, `ORDER BY`.
Practice: contacts book that survives restarts, expense tracker.
Read: https://docs.python.org/3/library/sqlite3.html and https://sqlbolt.com (interactive SQL lessons)

## 7. APIs and HTTP requests

```python
import requests

resp = requests.get('https://api.github.com/users/octocat', timeout=10)
print(resp.status_code)      # 200 means OK
data = resp.json()           # JSON -> Python dict
print(data['login'])
```

Learn: status codes (200, 404, 401, 500), JSON, API keys (store in `.env`, load with `python-dotenv`).

```python
import os
from dotenv import load_dotenv

load_dotenv()
key = os.getenv('API_KEY')
```

Practice: weather app, GitHub profile viewer, currency converter.
Read: https://requests.readthedocs.io and https://pypi.org/project/python-dotenv/

## 8. First AI project

When topics 2–7 feel comfortable, build a small AI program: a terminal chatbot that sends your message to an AI API and prints the answer.

- Read the Claude API docs: https://docs.claude.com
- Keep your API key in `.env` and never commit it.
- Start tiny: one question in, one answer out. Then add a loop for a conversation, then save history to a file or SQLite.

## Debugging checklist

1. Read the error from the **bottom up**: last line = what, lines above = where.
2. Common ones: `SyntaxError` (typo), `NameError` (variable not defined), `TypeError` (wrong type, e.g. text + number), `IndexError` (list too short), `KeyError` (missing dict key), `IndentationError` (spaces).
3. Add `print()` to see values, or paste the code into Python Tutor to watch it run: https://pythontutor.com
4. Search the exact error message, and read the docs page for the function.
5. Take a break, then explain the problem out loud, line by line.

## Style (from `docs/conventions.md` + PEP 8)

- `snake_case` for variables and functions, `CapitalizedWords` for classes.
- 4 spaces for indentation.
- Short comments that explain *why* or *what this part does*. Never leave code commented out.
- Folders lowercase with hyphens and two digits: `lecture-01`.
- PEP 8: https://peps.python.org/pep-0008/

## Project ideas, easiest to hardest

1. Number guessing game
2. To-do list (terminal) saved to a file
3. Quiz game with questions in a dict or JSON file
4. Expense tracker with SQLite
5. Bank account simulator with classes (like `py-bank`)
6. Weather or news app using a public API
7. Telegram or Discord bot
8. A chatbot using an AI API

## Online books and courses

- Python for Everybody (free course): https://www.py4e.com
- Official tutorial: https://docs.python.org/3/tutorial/
- Automate the Boring Stuff (free online): https://automatetheboringstuff.com
- Python docs: https://docs.python.org/3/
- W3Schools Python: https://www.w3schools.com/python
- 30 Days of Python (projects): https://github.com/Asabeneh/30-Days-Of-Python
- Real Python (articles): https://realpython.com
- Exercism Python track (exercises with feedback): https://exercism.org/tracks/python
- Python Tutor (visualize code): https://pythontutor.com
- PyPI (find packages): https://pypi.org
