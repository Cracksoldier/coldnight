---
title: My Terminal Setup in 2024
date: 2024-01-23 10:00:00
categories: [Tools]
tags: [terminal, zsh, productivity, dotfiles]
excerpt: The shell, prompt, and tooling that make up my terminal environment — what I use, why, and the bits that took the most iteration to get right.
---

{% note info %}
Like a handful of other posts on this demo site, this one deliberately omits `cover_image` to show the `cover.default` fallback in action on post cards.
{% endnote %}

My terminal setup is stable enough that I haven't made major changes in about a year. Here's what it looks like and why each piece is there.

## Shell: zsh with minimal config

I use zsh with a hand-written config rather than a framework like Oh My Zsh. Frameworks are convenient but slow to load and hard to understand when something breaks.

Key options I always set:

```zsh
# History
HISTSIZE=100000
SAVEHIST=100000
HISTFILE=~/.zsh_history
setopt SHARE_HISTORY          # share history across sessions
setopt HIST_IGNORE_DUPS       # don't store duplicate commands
setopt HIST_IGNORE_SPACE      # don't store commands prefixed with space

# Navigation
setopt AUTO_CD                # type a directory name to cd into it
setopt AUTO_PUSHD             # push dirs onto stack automatically

# Completion
autoload -Uz compinit && compinit
zstyle ':completion:*' menu select
zstyle ':completion:*' matcher-list 'm:{a-z}={A-Z}'  # case-insensitive
```

## Prompt: Starship

[Starship](https://starship.rs) is a cross-shell prompt written in Rust. It's fast, configurable, and shows exactly what I want: directory, git branch, git status, language version when relevant, and exit code on failure.

```toml
# ~/.config/starship.toml
format = """
$directory$git_branch$git_status$cmd_duration
$character"""

[directory]
truncation_length = 3
truncate_to_repo = true

[git_branch]
format = " [$symbol$branch]($style) "

[git_status]
format = '([$all_status$ahead_behind]($style) )'
conflicted = "⚡"
modified = "!"
untracked = "?"
staged = "+"
```

The two-line format keeps long paths from pushing the cursor too far right.

## Terminal: WezTerm

[WezTerm](https://wezfurlong.org/wezterm/) is a GPU-accelerated terminal emulator configured in Lua. The Lua config is more verbose than a YAML file but far more capable — I can define keybindings as real functions rather than key sequences.

What I actually use:
- Multiplexing without tmux (WezTerm has native panes and tabs)
- True colour (correctly renders colour schemes in Neovim)
- Ligatures for the font

## Editor: Neovim

Neovim with [lazy.nvim](https://github.com/folke/lazy.nvim) for plugin management. The plugin count crept up over the years; I've been cutting it back down. Plugins I currently consider load-bearing:

| Plugin | Purpose |
|--------|---------|
| nvim-lspconfig | LSP client config |
| nvim-cmp | Completion engine |
| telescope.nvim | Fuzzy finding (files, grep, buffers) |
| nvim-treesitter | Better syntax highlighting and text objects |
| gitsigns.nvim | Git hunks in the gutter |
| oil.nvim | File explorer that behaves like a buffer |

## Tools that replaced GNU coreutils

| Replaced | With | Why |
|----------|------|-----|
| `cat` | `bat` | syntax highlighting, line numbers, git diff integration |
| `ls` | `eza` | colour, icons, git status, tree view |
| `find` | `fd` | faster, friendlier syntax, respects `.gitignore` |
| `grep` | `rg` | faster, respects `.gitignore`, better defaults |
| `top` | `btm` | better layout, mouse support |

None of these are essential but they make the terminal noticeably more pleasant to work in.

## What I stopped using

- **tmux** — WezTerm's native multiplexing is good enough
- **nvm/pyenv/rbenv** — replaced by [mise](https://mise.jdx.dev), one tool for all language versions
- **Oh My Zsh** — the overhead isn't worth it for my use case
- **aliases for git subcommands** — I use the full commands now; muscle memory is more durable
