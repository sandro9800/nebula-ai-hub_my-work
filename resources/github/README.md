# GitHub guide

Git is the tool on your computer. **GitHub** is the website that stores your Git repositories online, so you have a backup, can work from any computer, and can share or collaborate.

## 1. What GitHub gives you

- **Backup and history** of your code online
- **Portfolio** — your profile and repos show what you have built
- **Collaboration** — issues, pull requests, code review
- **Automation** — GitHub Actions can run tests on every push
- **Hosting for docs** — `README.md` files render nicely on the repo page

## 2. Connecting your computer to GitHub

Pushing needs proof that it's you. GitHub does not accept your account password for `git push`. Pick one:

**Option A: HTTPS + personal access token (easiest to start)**
1. GitHub → Settings → Developer settings → Personal access tokens.
2. Create a token with access to your repo (scope `repo`, or a fine-grained token for one repo).
3. When Git asks for a password, paste the token. A credential manager will remember it.

**Option B: SSH key (best long-term)**
```
ssh-keygen -t ed25519 -C 'you@example.com'
cat ~/.ssh/id_ed25519.pub        # copy this output
```
GitHub → Settings → SSH and GPG keys → New SSH key → paste. Test with `ssh -T git@github.com`.
Guide: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

Never share a token or private key (`id_ed25519`, without `.pub`) with anyone, and never put one in a repo.

## 3. Your repo: `nebula-ai-hub_my-work`

The layout, and what goes where:

```
nebula-ai-hub_my-work/
  README.md
  requirements.txt
  docs/          rules, roadmap, learning log, weekly check
  lectures/      lecture-01, lecture-02, ... (main.py, main_improved.py, notes.md)
  homeworks/     hw-01, hw-02, ...
  side-projects/ one folder per project
  resources/     books, guides (git, github, python), links
```

First time on a new computer:
```
git clone https://github.com/sandro9800/nebula-ai-hub_my-work.git
cd nebula-ai-hub_my-work
```

## 4. Everyday flow

```
git pull
# work
git add .
git commit -m 'add lecture-02 notes'
git push
```

After `git push`, open the repo page on GitHub and check that your commit is there. Click a commit to see exactly what changed (green = added, red = removed).

## 5. Good README files

Every folder should have a short `README.md`: what it is, how to run it. Example for a project:

```
# py-bank

A small bank simulator in Python.

## Run
    python main.py

## Test
    python -m unittest
```

Write them in Markdown: `# Heading`, `**bold**`, `- list`, backticks for code. Cheat sheet: https://www.markdownguide.org/cheat-sheet/

## 6. Pull requests (PRs)

A PR says: "please merge my branch into `main`". Even working alone, PRs are good practice.

1. Create a branch and push it: `git switch -c add-tests` ... `git push -u origin add-tests`
2. On GitHub click **Compare & pull request**, write a title and short description.
3. Read the **Files changed** tab, as if reviewing someone else's work.
4. Click **Merge pull request**, then delete the branch.
5. Locally: `git switch main` and `git pull`.

## 7. Issues

Use Issues as a to-do list for a repo: one idea or bug per issue (`add input validation to py-bank`). Mention them in commits with `fixes #3` and GitHub closes the issue for you.

## 8. Keeping secrets safe

- Put keys and passwords in `.env`, and put `.env` in `.gitignore` (see `docs/conventions.md`).
- Commit a `.env.example` with fake values so you remember which variables exist.
- If a secret ever reaches GitHub, **revoke it and make a new one right away**. Deleting the file is not enough, the history keeps it.
- A repo that is public is visible to everyone. Check **Settings → General** to see if it is Private or Public.

## 9. Forks and open source

A **fork** is your own copy of someone else's repo. To contribute: fork → clone → branch → commit → push → open a PR to the original. Look for issues labeled `good first issue`.

## 10. Make your profile look good

- Pin your best 2–6 repos on your profile.
- Add a description and topics to each repo (the gear icon on the repo page).
- Keep commits small and messages clear. Your history is part of your portfolio.
- Optional: a profile README (a repo named exactly like your username with a `README.md`).

## 11. GitHub Actions (later)

Automation that runs when you push, for example running your tests. Workflows are YAML files in `.github/workflows/`. Start here when you have tests: https://docs.github.com/en/actions/get-started/quickstart

## 12. Common problems

- **Push asks for a password and fails** — use a token or SSH (section 2).
- **`remote: Permission denied`** — you are logged in as a different account or the token lacks access to the repo.
- **Large file rejected (over 100 MB)** — GitHub blocks it. Keep big files out of the repo or use Git LFS. Note: `resources/` already holds large PDFs, so avoid adding many more.
- **Changed on GitHub's website and locally** — run `git pull` first, resolve conflicts if any, then push.

## 13. Practice

1. Make a new repo on GitHub with a README, clone it, edit the README, push.
2. Open an issue, fix it in a branch, and close it with a PR.
3. Add a `.gitignore` and a `.env.example` to one of your projects.
4. Do the free GitHub Skills courses below.

## 14. Learning links

- GitHub Hello World: https://docs.github.com/en/get-started/start-your-journey/hello-world
- GitHub Docs: https://docs.github.com
- GitHub Skills (free interactive courses): https://skills.github.com
- `.gitignore` templates: https://github.com/github/gitignore
- Writing on GitHub (Markdown): https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax
- GitHub Actions quickstart: https://docs.github.com/en/actions/get-started/quickstart
