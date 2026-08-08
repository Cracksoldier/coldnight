---
title: Syntax Highlighting Showcase
date: 2026-05-15 10:00:00
updated: 2026-07-15
categories: [Development]
tags: [syntax-highlighting, code, javascript, python]
cover_image: https://picsum.photos/800/450
excerpt: A tour of syntax highlighting across JavaScript, TypeScript, Python, CSS, JSON, and Bash — all rendered by the built-in highlight.js processor.
---

Every code block on this blog is processed at build time by Hexo's highlight.js renderer. The output is static HTML — no runtime JS required for coloring.

## JavaScript

```javascript
// Fibonacci with memoisation
function fib(n, memo = {}) {
  if (n in memo) return memo[n]
  if (n <= 1) return n
  memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
  return memo[n]
}

const results = Array.from({ length: 10 }, (_, i) => fib(i))
console.log(results) // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

## TypeScript

```typescript
interface Post {
  title: string
  date: Date
  tags: string[]
  published: boolean
}

function formatPost(post: Post): string {
  const tags = post.tags.map(t => `#${t}`).join(' ')
  return `[${post.date.toISOString().slice(0, 10)}] ${post.title} — ${tags}`
}

const demo: Post = {
  title: 'Syntax Highlighting Showcase',
  date: new Date('2026-05-15'),
  tags: ['code', 'hexo'],
  published: true,
}

console.log(formatPost(demo))
```

## Python

```python
from dataclasses import dataclass, field
from typing import Optional
import re

@dataclass
class BlogPost:
    title: str
    slug: str
    tags: list[str] = field(default_factory=list)
    word_count: int = 0

    @classmethod
    def from_markdown(cls, raw: str) -> 'BlogPost':
        title_match = re.search(r'^# (.+)$', raw, re.MULTILINE)
        title = title_match.group(1) if title_match else 'Untitled'
        slug = re.sub(r'\W+', '-', title.lower()).strip('-')
        words = len(re.findall(r'\w+', raw))
        return cls(title=title, slug=slug, word_count=words)

post = BlogPost.from_markdown('# Hello World\n\nThis is a test.')
print(f'{post.slug}: {post.word_count} words')
```

## CSS

```css
/* Card component with hover transition */
.post-card {
  background: #0f2040;
  border: 1px solid #1e3a6e;
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.post-card:hover {
  border-color: #2563eb;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

.post-card__title {
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

## JSON

```json
{
  "name": "coldnight",
  "version": "1.0.0",
  "description": "Dark deep-navy Hexo blog theme",
  "config": {
    "navbar": {
      "title": "My Blog",
      "links": [
        { "name": "Home", "url": "/" },
        { "name": "Archive", "url": "/archives" }
      ]
    },
    "lightgallery": {
      "enabled": true,
      "zoom": true,
      "thumbnail": true
    }
  }
}
```

## Bash

```bash
#!/usr/bin/env bash
set -euo pipefail

BLOG_DIR="${1:-$PWD}"
OUTPUT_DIR="$BLOG_DIR/public"

echo "Building blog at $BLOG_DIR..."
cd "$BLOG_DIR"

# Clean previous build
hexo clean

# Generate and count output files
hexo generate 2>&1 | tee /tmp/hexo.log
FILE_COUNT=$(find "$OUTPUT_DIR" -name '*.html' | wc -l)

echo "Done — generated ${FILE_COUNT} HTML files"
```

## YAML

```yaml
# Theme configuration
navbar:
  title: "Coldnight"
  links:
    - name: Home
      url: /
    - name: Archive
      url: /archives

sidebar:
  position: right
  widgets:
    - recent_posts
    - tags
    - archives

lightgallery:
  enabled: true
  auto_mount: true
  zoom: true
  thumbnail: true
```

## SQL

```sql
-- Top 10 posts by view count in the last 30 days
SELECT
    p.slug,
    p.title,
    COUNT(v.id)        AS views,
    COUNT(DISTINCT v.visitor_id) AS unique_visitors
FROM posts p
JOIN page_views v
    ON v.post_id = p.id
   AND v.viewed_at >= NOW() - INTERVAL '30 days'
WHERE p.published = TRUE
GROUP BY p.id, p.slug, p.title
ORDER BY views DESC
LIMIT 10;
```

## Downloadable filename chip

A first-line `// filename: ...` comment (or `#`/`/* */` for other languages) tags a block with a source filename. It renders as a chip in the toolbar — click it to download the block's contents as that file.

```javascript
// filename: fib.js
function fib(n, memo = {}) {
  if (n in memo) return memo[n]
  if (n <= 1) return n
  memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
  return memo[n]
}
```
