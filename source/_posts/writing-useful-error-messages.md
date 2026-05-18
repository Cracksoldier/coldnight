---
title: Writing Useful Error Messages
date: 2024-07-15 09:00:00
categories: [Development]
tags: [ux, errors, api-design, debugging]
excerpt: Error messages are the interface between your code and the person debugging it, often at 2am under pressure. The difference between a helpful one and a useless one is mostly just care.
---

Error messages are written once and read many times, under stress, by people trying to understand what went wrong. Treating them as an afterthought is a form of technical debt.

## What a good error message contains

A useful error message answers three questions:

1. **What happened?** — the concrete fact of the failure
2. **Why did it happen?** — the cause, to the extent it's knowable
3. **What now?** — what the reader should do next, if there's an obvious path

You don't always have all three. A network timeout might not have a clear cause. But the more you can provide, the faster someone gets unstuck.

## Bad and better

**Validation error:**

```
// Bad
Error: validation failed

// Better
Error: invalid email address — "user@" is missing a domain (expected format: user@example.com)
```

**File not found:**

```
// Bad
Error: file not found

// Better
Error: config file not found at /etc/myapp/config.toml
  Searched: /etc/myapp/config.toml, ~/.config/myapp/config.toml, ./config.toml
  Create one with: myapp init
```

**Database error:**

```
// Bad
Error: query failed

// Better
Error: failed to insert user record — duplicate key on (email)
  A user with email "alex@example.com" already exists (user_id: 4821)
```

## Include the value that failed

Any error involving a user-supplied value should include that value in the message. "Invalid email address" is less useful than `invalid email address: "notanemail"`. The reader immediately knows whether they're looking at a typo, a test value, or a bug.

```go
if !isValidEmail(email) {
    return fmt.Errorf("invalid email address: %q", email)
}
```

## Error wrapping in Go

Wrap errors with context as they travel up the call stack:

```go
func getUser(id int) (*User, error) {
    user, err := db.QueryUser(id)
    if err != nil {
        return nil, fmt.Errorf("getUser(%d): %w", id, err)
    }
    return user, nil
}
```

The `%w` verb wraps the error so callers can inspect it with `errors.Is` and `errors.As`. The prefix tells you where in the call stack the error occurred without a stack trace.

A chain like `getUser(42): query row: no rows found` gives you the operation, the ID, and the root cause in one line.

## HTTP API errors

API errors should be structured and consistent. Returning different shapes for different error types forces clients to write brittle parsing code.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request body is invalid",
    "details": [
      {
        "field": "email",
        "message": "must be a valid email address",
        "value": "notanemail"
      }
    ]
  }
}
```

- `code` is a stable machine-readable string — clients can switch on it
- `message` is a human-readable description
- `details` carries field-level validation errors

Document every error code your API can return. An undocumented error code is an error message that says nothing.

## Logs vs. errors returned to users

Not all error information belongs in the user-visible message. Stack traces, internal IDs, and SQL query strings should go in your logs, not in the response body. Return a correlation ID the user can quote when contacting support:

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred",
    "request_id": "req_9kJm3pQxL"
  }
}
```

The request ID lets you pull the full context from your logs without exposing it to the client.
