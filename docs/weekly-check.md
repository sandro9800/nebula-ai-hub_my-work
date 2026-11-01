# Weekly check — trigger phrase: "ნებულას მიხედე"

When Sandro says the trigger phrase, do all of this WITHOUT asking for confirmation.
All work happens in the GitHub repo `nebula-ai-hub_my-work` (not Google Drive).

1. Go through the whole `nebula-ai-hub_my-work` repo.
2. Move misplaced files to the right place with `git mv`: `lectures/lecture-NN/`, `homeworks/hw-NN/`, `side-projects/<project-name>/`, `docs/`, `resources/`. Rename folders/files to the conventions (lowercase, hyphens, two-digit numbers).
3. For every lecture/homework folder that has `main.py` but no `main_improved.py`: create `main_improved.py`.
   - Same code as `main.py`, uncommented and working.
   - Flat style like `main.py`: no `def` functions, no menus, no extra structure.
   - Short comments that explain what each part does. Never leave code commented out.
   - Fix obvious bugs (e.g. `int()` around `input()` when comparing numbers).
   - Never edit the original `main.py`.
4. Create a short `README.md` (what it is, how to run) in any folder that lacks one.
5. Never delete Sandro's own files. Only replace files that were created by Claude.
6. Commit the changes with short imperative messages (see `conventions.md`), e.g. `move lecture notes into lectures/`, `add main_improved.py to lecture-02`. Never commit `.env` or secrets.
7. Finish with a short summary in Georgian: what was moved, what was created.
