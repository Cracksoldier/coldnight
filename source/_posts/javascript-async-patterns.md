---
title: Modern JavaScript Async Patterns
date: 2026-04-10 08:00:00
categories: [Development]
tags: [javascript, async, promises, patterns]
cover_image: https://picsum.photos/800/450
excerpt: A practical reference for async/await, Promise combinators, AbortController, and async generators — with annotated examples.
pinned: true
card_border: "#f5c518"
card_bg: "#1c1608"
---

Asynchronous JavaScript has evolved significantly. This post collects the patterns worth knowing in 2026.

## async / await basics

```javascript
async function loadUser(id) {
  const response = await fetch(`/api/users/${id}`)

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

// Consuming it
try {
  const user = await loadUser(42)
  console.log(user.name)
} catch (err) {
  console.error('Failed to load user:', err.message)
}
```

## Promise.all — parallel independent requests

```javascript
async function loadDashboard(userId) {
  const [user, posts, notifications] = await Promise.all([
    fetch(`/api/users/${userId}`).then(r => r.json()),
    fetch(`/api/posts?author=${userId}`).then(r => r.json()),
    fetch(`/api/notifications?userId=${userId}`).then(r => r.json()),
  ])

  return { user, posts, notifications }
}
```

## Promise.allSettled — tolerate partial failures

```javascript
async function syncAll(items) {
  const results = await Promise.allSettled(
    items.map(item => uploadItem(item))
  )

  const succeeded = results.filter(r => r.status === 'fulfilled').length
  const failed = results
    .filter(r => r.status === 'rejected')
    .map(r => r.reason.message)

  console.log(`${succeeded}/${items.length} succeeded`)
  if (failed.length) console.warn('Failures:', failed)
}
```

## AbortController — cancellable fetches

```javascript
function fetchWithTimeout(url, ms = 5000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)

  return fetch(url, { signal: controller.signal })
    .finally(() => clearTimeout(timer))
}

// Cancel on user action
const controller = new AbortController()

document.querySelector('#cancel').addEventListener('click', () => {
  controller.abort()
})

const data = await fetch('/api/slow-endpoint', {
  signal: controller.signal,
})
```

## Async generators — streaming data

```javascript
async function* paginate(endpoint, pageSize = 20) {
  let cursor = null

  while (true) {
    const url = cursor
      ? `${endpoint}?cursor=${cursor}&limit=${pageSize}`
      : `${endpoint}?limit=${pageSize}`

    const { items, nextCursor } = await fetch(url).then(r => r.json())
    yield* items

    if (!nextCursor) break
    cursor = nextCursor
  }
}

// Consume all posts lazily
for await (const post of paginate('/api/posts')) {
  await indexPost(post) // process one at a time, no memory spike
}
```

## Error boundaries with a retry wrapper

```javascript
async function withRetry(fn, { attempts = 3, delay = 500 } = {}) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (err) {
      if (i === attempts - 1) throw err
      await new Promise(resolve => setTimeout(resolve, delay * 2 ** i))
    }
  }
}

const data = await withRetry(() => fetch('/api/unstable').then(r => r.json()))
```

{% note tip %}
`withRetry` uses exponential backoff: delay doubles on each attempt (`delay * 2^i`). Pass `{ attempts: 5, delay: 200 }` for more aggressive retry strategies.
{% endnote %}
