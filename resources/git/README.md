# Git guide

Git is a tool that saves the history of your files. You can go back to any earlier version, see what changed, and work on new ideas without breaking the working version.

## 1. The mental model

Git has three places your files can be in:

1. **Working directory** — the files you edit on your computer.
2. **Staging area** — the files you picked to go into the next save (`git add`).
3. **Repository** — the saved history (`git commit`). A commit is one snapshot with a message.

Then **GitHub** is a copy of the repository online (`git push` sends commits there, `git pull` brings new ones back).

```
edit files -> git add -> git commit -> git push
(working dir)  (staging)   (repository)   (GitHub)
```

## 2. One-time setup

```
git config --global user.name 'Your Name'
git config --global user.email 'you@example.com'
git config --global init.defaultBranch main
git config --list
```

On Windows `cmd` use double quotes instead of single quotes.

## 3. Start a repo

```
git clone https://github.com/sandro9800/nebula-ai-hub_my-work.git   # copy an existing repo
git init                                                          # or start a new one in the current folder
```

## 4. The daily workflow

```
git pull                       # 1. get the latest first
# ... edit files ...
git status                     # 2. see what changed
git diff                       # 3. see the exact lines changed
git add lectures/lecture-02    # 4. stage what you want to save (or: git add .)
git commit -m 'add lecture-02 notes'   # 5. save a snapshot
git push                       # 6. send it to GitHub
```

Tip: run `git status` often. It always tells you what to do next.

## 5. Writing good commit messages

Follow `docs/conventions.md`: short, imperative, one idea per commit.

- Good: `add lecture-02 notes`, `fix input bug in homework 03`, `move resources into resources/`
- Bad: `stuff`, `update`, `final final 2`, `changed a lot of things`

Rule of thumb: finish the sentence "If applied, this commit will ..."

## 6. Command reference

| Command | What it does |
|---|---|
| `git status` | Shows changed, staged and untracked files |
| `git add <file>` / `git add .` | Stages a file / everything |
| `git commit -m '<msg>'` | Saves staged changes with a message |
| `git push` / `git pull` | Send / get commits from GitHub |
| `git log --oneline` | Short history, one line per commit |
| `git log --oneline --graph --all` | History with branches drawn |
| `git diff` | Changes not yet staged |
| `git diff --staged` | Changes that are staged |
| `git show <commit>` | What one commit changed |
| `git mv old new` | Move or rename a file (Git tracks it) |
| `git rm <file>` | Delete a file and stage the deletion |
| `git restore <file>` | Throw away unstaged changes to a file |
| `git restore --staged <file>` | Unstage a file (keep the changes) |
| `git branch` | List branches |
| `git switch -c <name>` | Create and switch to a new branch |
| `git switch <name>` | Switch to an existing branch |
| `git merge <name>` | Merge a branch into the current one |
| `git stash` / `git stash pop` | Put changes aside / bring them back |
| `git remote -v` | Show where `push` and `pull` go |

## 7. Branches

A branch is a separate line of work. Use one when you try something new so `main` always stays working.

```
git switch -c add-py-bank-tests      # create + switch
# ... edit, add, commit ...
git switch main
git merge add-py-bank-tests          # bring the work into main
git branch -d add-py-bank-tests      # delete the finished branch
```

For a solo learning repo, committing straight to `main` is fine. Use branches for bigger side-projects.

## 8. Undoing things (the most useful part)

| Situation | Fix |
|---|---|
| Edited a file and want the old version back | `git restore <file>` |
| Staged the wrong file | `git restore --staged <file>` |
| Last commit message has a typo (not pushed yet) | `git commit --amend -m 'new message'` |
| Forgot a file in the last commit (not pushed yet) | `git add <file>` then `git commit --amend --no-edit` |
| A commit was a mistake and is already pushed | `git revert <commit>` (makes a new commit that undoes it) |
| Want to look at an old version | `git switch --detach <commit>`, then `git switch main` to come back |

Avoid `git reset --hard` and `git push --force` until you fully understand them. They can delete work for good.

## 9. `.gitignore`

A file named `.gitignore` lists things Git must never save. For this repo it should include at least:

```
.env
__pycache__/
*.pyc
.venv/
.DS_Store
node_modules/
```

Ready-made templates: https://github.com/github/gitignore (use `Python.gitignore`).

If you already committed a secret (like `.env`), removing it later is not enough: it stays in history. Change the secret (new API key) immediately.

## 10. Common problems

- **`fatal: not a git repository`** — you are in the wrong folder. `cd` into the repo.
- **`rejected ... fetch first` / `non-fast-forward`** — GitHub has commits you don't. Run `git pull`, then `git push`.
- **Merge conflict** — Git marks the file with `<<<<<<<`, `=======`, `>>>>>>>`. Edit the file to keep what you want, delete the markers, then `git add <file>` and `git commit`.
- **`Author identity unknown`** — do the one-time setup in section 2.
- **A file won't stop showing up as changed** — check `.gitignore`; ignoring only works for files not yet committed.
- **Authentication failed on push** — GitHub no longer accepts account passwords. Use a personal access token or SSH (see the [GitHub guide](../github/README.md)).

## 11. Practice (do these in order)

1. Make a test repo: `git init`, create `hello.txt`, `git add`, `git commit`.
2. Change the file, run `git diff`, commit again, read `git log --oneline`.
3. Break the file on purpose, then fix it with `git restore`.
4. Create a branch, commit on it, merge it into `main`.
5. Cause a merge conflict on purpose (edit the same line on two branches) and resolve it.
6. Finish the interactive game below.

## 12. Learning links

- Pro Git book (free, the standard reference): https://git-scm.com/book/en/v2 — read chapters 1–3 first
- Git command docs: https://git-scm.com/docs
- Git cheat sheet: https://git-scm.com/cheat-sheet
- Learn Git Branching (interactive game, best for branches): https://learngitbranching.js.org
- Atlassian Git tutorials: https://www.atlassian.com/git/tutorials
- Oh Shit, Git!?! (fixes for common mistakes): https://ohshitgit.com
- Visualizing Git concepts: https://git-school.github.io/visualizing-git/
