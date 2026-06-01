---
title: Diagramming with Mermaid
date: 2026-05-20 12:00:00
categories: [Development]
tags: [mermaid, diagrams, documentation]
cover_image: https://placeholdpicsum.dev/800x450
excerpt: "Embed flowcharts, sequence diagrams, ER diagrams, and more directly in Markdown using fenced mermaid code blocks — rendered as crisp SVGs at build time."
abstract: "This post demonstrates **Mermaid** diagram support: flowcharts, sequence diagrams, and ER diagrams using fenced `mermaid` code blocks — rendered as inline SVGs."
---

Mermaid lets you describe diagrams as text and renders them as SVG in the browser. No image files, no external tools — just a fenced code block with the `mermaid` language tag.

## Flowchart

Decision flows and pipelines are the most common use case. Mermaid's `graph` syntax handles both simple and branching paths cleanly.

```mermaid
graph TD
  A([User submits form]) --> B{Valid input?}
  B -->|No| C[Show validation errors]
  C --> A
  B -->|Yes| D[Save to database]
  D --> E{Send email?}
  E -->|Yes| F[Queue welcome email]
  E -->|No| G
  F --> G([Redirect to dashboard])
```

## Sequence Diagram

Sequence diagrams are ideal for documenting API flows, authentication handshakes, or any interaction between two or more actors.

```mermaid
sequenceDiagram
  actor User
  participant Browser
  participant API
  participant DB

  User->>Browser: Click "Log in"
  Browser->>API: POST /auth/login {email, password}
  API->>DB: SELECT * FROM users WHERE email = ?
  DB-->>API: user row
  API->>API: bcrypt.compare(password, hash)
  alt Invalid credentials
    API-->>Browser: 401 Unauthorized
    Browser-->>User: Show error message
  else Valid credentials
    API-->>Browser: 200 { token, expiresAt }
    Browser->>Browser: Store token in localStorage
    Browser-->>User: Redirect to dashboard
  end
```

## Entity Relationship Diagram

ER diagrams help document database schemas alongside the posts that describe them.

```mermaid
erDiagram
  USER {
    uuid id PK
    string email UK
    string password_hash
    timestamp created_at
  }
  POST {
    uuid id PK
    uuid author_id FK
    string title
    string slug UK
    text content
    timestamp published_at
  }
  TAG {
    uuid id PK
    string name UK
  }
  POST_TAG {
    uuid post_id FK
    uuid tag_id FK
  }

  USER ||--o{ POST : "writes"
  POST ||--o{ POST_TAG : "has"
  TAG ||--o{ POST_TAG : "applied to"
```

## State Diagram

State diagrams work well for documenting lifecycle models — order states, subscription tiers, connection states.

```mermaid
stateDiagram-v2
  [*] --> Draft

  Draft --> InReview : Submit for review
  InReview --> Draft : Request changes
  InReview --> Scheduled : Approve
  Scheduled --> Published : Publish time reached
  Published --> Archived : Archive

  Draft --> Deleted : Delete
  InReview --> Deleted : Delete

  Archived --> [*]
  Deleted --> [*]
```

## Git Graph

The `gitGraph` diagram type is a natural fit for documenting branching strategies.

```mermaid
gitGraph
  commit id: "Initial commit"
  commit id: "Add project scaffold"

  branch feature/auth
  checkout feature/auth
  commit id: "Add JWT middleware"
  commit id: "Add login endpoint"
  commit id: "Add refresh token"

  checkout main
  branch feature/posts
  checkout feature/posts
  commit id: "Add post model"
  commit id: "Add CRUD endpoints"

  checkout main
  merge feature/auth id: "Merge auth"
  merge feature/posts id: "Merge posts"
  commit id: "v1.0.0"
```

---

Toggle the feature off at any time by setting `mermaid.enabled: false` in `themes/coldnight/_config.yml` — the blocks revert to plain highlighted code.
