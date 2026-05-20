---
title: Practical Bash Scripting
date: 2026-03-20 08:00:00
categories: [Development]
tags: [bash, cli, scripting, linux]
cover_image: https://placeholdpicsum.dev/800x450
excerpt: Strict mode, argument parsing, logging helpers, and patterns for scripts that behave predictably and fail loudly.
---

Shell scripts tend to accumulate tech debt faster than most code. These patterns keep them maintainable.

## The strict-mode header

```bash
#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

# -e  exit immediately on non-zero exit code
# -u  treat unset variables as errors
# -o pipefail  pipeline fails if any command fails
# IFS  safer word-splitting (spaces won't split filenames)
```

{% note warning %}
`set -e` can interact unexpectedly with `if` statements and `||` chains. Test scripts thoroughly — or use `set -E` and trap `ERR` for more predictable error propagation.
{% endnote %}

## Argument parsing

```bash
#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<EOF
Usage: $(basename "$0") [OPTIONS] <input-file>

Options:
  -o, --output FILE   Write output to FILE (default: stdout)
  -v, --verbose       Enable verbose logging
  -h, --help          Show this help message
EOF
}

OUTPUT=""
VERBOSE=false

while [[ $# -gt 0 ]]; do
  case $1 in
    -o|--output)  OUTPUT="$2"; shift 2 ;;
    -v|--verbose) VERBOSE=true; shift ;;
    -h|--help)    usage; exit 0 ;;
    --)           shift; break ;;
    -*)           echo "Unknown option: $1" >&2; usage; exit 1 ;;
    *)            break ;;
  esac
done

INPUT="${1:-}"
if [[ -z "$INPUT" ]]; then
  echo "Error: input file required" >&2
  usage
  exit 1
fi
```

## Logging helpers

```bash
# ANSI colours only when connected to a terminal
if [[ -t 2 ]]; then
  RED='\033[0;31m'; YELLOW='\033[0;33m'
  GREEN='\033[0;32m'; RESET='\033[0m'
else
  RED=''; YELLOW=''; GREEN=''; RESET=''
fi

log_info()    { echo -e "${GREEN}INFO${RESET}  $*" >&2; }
log_warn()    { echo -e "${YELLOW}WARN${RESET}  $*" >&2; }
log_error()   { echo -e "${RED}ERROR${RESET} $*" >&2; }
log_verbose() { [[ "$VERBOSE" == true ]] && echo "DEBUG $*" >&2 || true; }
```

## Temporary files and cleanup

```bash
# mktemp + trap ensures cleanup even on error or SIGINT
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

TMPFILE=$(mktemp "$TMPDIR/work.XXXXXX")
log_verbose "Working in $TMPDIR"

# Write to temp, then atomically replace
process_data "$INPUT" > "$TMPFILE"
mv "$TMPFILE" "${OUTPUT:-/dev/stdout}"
```

## Parallel processing with wait

```bash
MAX_JOBS=4
running=0

for file in source/_posts/*.md; do
  process_post "$file" &
  (( running++ ))

  if (( running >= MAX_JOBS )); then
    wait -n 2>/dev/null || wait  # wait for any child (bash 4.3+), fallback: wait all
    (( running-- ))
  fi
done

wait  # wait for remaining jobs
log_info "All posts processed"
```

## Here-docs and heredocs as templates

```bash
generate_config() {
  local site_url="$1"
  local theme="$2"

  cat <<EOF
# Auto-generated — do not edit manually
url: ${site_url}
theme: ${theme}
deploy:
  type: git
  repo: $(git remote get-url origin)
  branch: gh-pages
EOF
}

generate_config "https://example.com" "coldnight" > _config.local.yml
```

{% note tip %}
Use `<<'EOF'` (single-quoted delimiter) when the heredoc should be treated literally with no variable expansion.
{% endnote %}
