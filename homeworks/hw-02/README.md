# hw-02

Week 2 class material turned into one runnable script: string methods, lists, tuples, sets and the while loop (break, continue).

## Task
Go through the week 2 class material (string methods, lists, tuples, sets, while) and make every example work.

## Approach
- `main.py` and `main_improved.py` only import the other files, importing a file runs it
- the improved files are flat scripts with short comments, no functions
- examples that crash in the class code (like `"hello".split("")` or `numbers[5]`) are replaced with working ones or left out
- set results are printed with `sorted()` so the output is always the same
- the old store order system that was left commented out in the class file is not repeated, it is already in `hw-01`

## Files
- `main.py` — imports the two original class files (they are fully commented out, so it prints nothing)
- `Python_String_Methods.py`, `Python_Structures_While.py` — original class files
- `main_improved.py` — imports the two improved files below
- `string_methods_improved.py` — working string methods examples
- `structures_while_improved.py` — working lists, tuples, sets and while examples
- `Python_Theory_Guide_Week_2.pdf` — theory guide for the week

## How to run
```bash
python homeworks/hw-02/main_improved.py
```
