---
title: Building a Personal CLI Toolkit
date: 2025-08-19 10:00:00
categories: [Tools]
tags: [cli, bash, productivity, dotfiles]
excerpt: The scripts and aliases that live in my dotfiles — small tools that each save a few seconds but add up over a day of terminal work.
---

The best tools are the ones so embedded in your workflow you stop noticing them. Here's what lives in my `~/bin` and `.zshrc` after a few years of accumulation.

## The principles I follow

- **One job.** A script that does one thing is easier to trust and easier to replace.
- **Exit loudly.** Use `set -euo pipefail` in every bash script. Silent failures waste hours.
- **No magic dependencies.** If a tool requires something exotic to run, it won't survive a fresh machine setup.

## Fuzzy everything with fzf

[fzf](https://github.com/junegunn/fzf) is the single tool that changed how I use the terminal most. Pipe anything to it and get an interactive fuzzy filter.

```bash
# Open any file in the repo in $EDITOR
fe() {
  local file
  file=$(git ls-files | fzf --preview 'bat --color=always {}') && $EDITOR "$file"
}

# Switch git branches interactively
gb() {
  local branch
  branch=$(git branch --sort=-committerdate | fzf | tr -d ' ') && git checkout "$branch"
}

# Kill a process by name
fkill() {
  local pid
  pid=$(ps aux | fzf | awk '{print $2}') && kill -9 "$pid"
}
```

## A smarter cd

`z` (or its faster rewrite `zoxide`) tracks your most-visited directories and lets you jump to them by partial name.

```bash
# Instead of:
cd ~/Projects/work/backend/services/auth

# Just:
z auth
```

After a week of normal use it learns your patterns and the full path becomes unnecessary.

## Project-local environment with direnv

[direnv](https://direnv.net) automatically loads and unloads environment variables when you enter or leave a directory. Each project gets a `.envrc` file:

```bash
# .envrc
export DATABASE_URL="postgres://localhost/myapp_dev"
export LOG_LEVEL="debug"
export PORT=3001
```

No more sourcing `.env` files manually. No more accidentally running commands against production because you had the wrong `DATABASE_URL` in your shell.

## A git log worth reading

```bash
# ~/.gitconfig
[alias]
  lg = log --graph --pretty=format:'%C(yellow)%h%Creset %C(blue)%d%Creset %s %C(dim)%cr · %an%Creset' --abbrev-commit
```

Output:
```
* a3f8c12  (HEAD -> main) feat: add rate limiting
* 9d21e04  fix: handle empty input in parser
* 4c1b879  chore: update dependencies
```

## Watching files

`entr` reruns a command when files change. Better than most language-specific watchers because it works everywhere.

```bash
# Rerun tests when any Go file changes
find . -name '*.go' | entr -c go test ./...

# Rebuild when source changes
find src -name '*.ts' | entr -c npm run build
```

## A scratch buffer

A quick note that doesn't need to become a file:

```bash
# Open a temp file in $EDITOR, delete it on close
scratch() {
  local tmp
  tmp=$(mktemp /tmp/scratch.XXXXXX.md)
  $EDITOR "$tmp"
  rm -f "$tmp"
}
```

## Keeping dotfiles in sync

All of this lives in a git repo at `~/.dotfiles`, symlinked into place with [GNU Stow](https://www.gnu.org/software/stow/).

```bash
cd ~/.dotfiles
stow zsh git bin  # creates symlinks in ~
```

One `git pull && stow` and a new machine is configured. The repo is the source of truth.
