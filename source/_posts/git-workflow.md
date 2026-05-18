---
title: A Clean Git Workflow for Solo Developers
date: 2026-03-06 09:00:00
categories: [Development]
tags: [git, workflow, version-control]
cover_image: https://picsum.photos/seed/git/800/450
excerpt: Conventional commits, interactive rebase, useful aliases, and the few commands that make up 90% of daily git usage.
---

Git has hundreds of commands. In practice, you use about a dozen. Here are the ones worth internalising and the patterns that keep history readable.

## Conventional commits

Prefix commit messages with a type to make history scannable at a glance.

```
feat:     new feature or capability
fix:      bug fix
docs:     documentation changes only
style:    formatting, whitespace (no logic change)
refactor: code change that is neither feat nor fix
perf:     performance improvement
test:     adding or correcting tests
chore:    build, dependency, or config changes
```

Examples:

```bash
git commit -m "feat: add LightGallery auto-mount to post pages"
git commit -m "fix: language label not rendering (inject data-lang at build time)"
git commit -m "chore: update hexo-renderer-stylus to v3.0.1"
```

## Daily aliases

```bash
# ~/.gitconfig
[alias]
  st   = status -sb
  co   = checkout
  br   = branch --sort=-committerdate
  lg   = log --oneline --graph --decorate -20
  undo = reset HEAD~1 --mixed
  wip  = !git add -A && git commit -m "chore: wip"
  unwip = reset HEAD~1 --mixed
```

```bash
git lg  # compact visual history
# * a3f8c12 (HEAD -> main) feat: add diff highlighting
# * 9d21e04 fix: copy button overlaps language label
# * 4c1b879 feat: add marked-line support
```

## Interactive rebase — cleaning up before a PR

```bash
# Squash the last 3 commits into one
git rebase -i HEAD~3
```

The editor opens with:

```diff
pick a3f8c12 feat: add diff highlighting
pick 9d21e04 fix: copy button position
pick 4c1b879 chore: remove debug log

# Change "pick" to "squash" or "s" to fold into the commit above
```

After editing:

```diff
pick a3f8c12 feat: add diff highlighting
squash 9d21e04 fix: copy button position
squash 4c1b879 chore: remove debug log
```

{% note warning %}
Never rebase commits that have already been pushed to a shared branch. Rebasing rewrites history — it forces other collaborators to `git pull --rebase` or re-clone.
{% endnote %}

## Useful one-liners

```bash
# Show what changed in the last commit
git show --stat

# Find which commit introduced a specific string
git log -S "data-lang" --oneline

# List files changed between two commits
git diff --name-only HEAD~5 HEAD

# Temporarily shelve uncommitted changes
git stash push -m "wip: trying new layout"
git stash pop

# Undo a pushed commit without rewriting history
git revert HEAD && git push

# See the full diff of a specific commit
git show a3f8c12
```

## .gitignore for a Hexo blog

```gitignore
# Hexo generated output
public/
.deploy_git/

# Runtime
db.json
node_modules/

# OS
.DS_Store
Thumbs.db

# Editor
.vscode/settings.json
*.swp
```

{% note tip %}
Commit `yarn.lock` or `package-lock.json`. It ensures everyone (and your CI) installs exactly the same dependency tree. Only omit lock files for published libraries — not for applications.
{% endnote %}
