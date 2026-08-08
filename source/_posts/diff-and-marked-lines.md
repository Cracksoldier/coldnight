---
title: Diff Highlighting & Marked Lines
date: 2026-04-17 09:30:00
categories: [Development]
tags: [git, diff, code, syntax-highlighting]
cover_image: https://picsum.photos/800/450
excerpt: Two advanced code block features — diff language for showing additions and deletions, and the mark option for highlighting specific lines.
---

Beyond standard token coloring, the theme supports two more code block modes that are useful in technical writing.

## Diff blocks

Use ` ```diff ` to show added and removed lines with green and red backgrounds.

```diff
- const API_URL = 'http://localhost:3000'
+ const API_URL = process.env.API_URL ?? 'http://localhost:3000'

  function fetchPosts(page = 1) {
-   return fetch(`${API_URL}/posts?page=${page}`)
+   return fetch(`${API_URL}/posts?page=${page}&per_page=9`)
      .then(res => res.json())
  }
```

Full function replacement:

```diff
- function formatDate(ts) {
-   return new Date(ts).toLocaleDateString()
- }
+ function formatDate(ts, locale = 'en-CA') {
+   return new Intl.DateTimeFormat(locale, {
+     year: 'numeric',
+     month: '2-digit',
+     day: '2-digit',
+   }).format(new Date(ts))
+ }
```

---

## Marked lines

Use the `{% codeblock %}` tag with `mark:` to highlight specific lines. Line numbers are 1-based; ranges use a hyphen.

Mark a single line (line 5):

{% codeblock javascript mark:5 %}
function createServer(options = {}) {
  const port = options.port ?? 4000
  const host = options.host ?? 'localhost'

  const server = http.createServer(requestHandler)

  server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`)
  })

  return server
}
{% endcodeblock %}

Mark multiple lines and a range (lines 1, 4–6):

{% codeblock python mark:1,4-6 %}
import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, 'public')
TEMPLATE_DIR = os.path.join(BASE_DIR, 'templates')

def resolve(path):
    return os.path.join(BASE_DIR, path)
{% endcodeblock %}

---

## Combined: diff inside a codeblock context

Real-world PR review scenario — here the diff shows what changed in a configuration file:

```diff
 # _config.yml
 syntax_highlighter: highlight.js
 highlight:
   line_number: true
   auto_detect: false
-  wrap: false
-  hljs: false
+  wrap: true
+  hljs: true
```

{% note tip %}
Use diff blocks in tutorials when showing before/after code. They are clearer than two separate code blocks and take up less vertical space.
{% endnote %}
