---
title: Postgres Full-Text Search Without the Overhead
date: 2025-02-11 09:00:00
categories: [Systems]
tags: [postgres, sql, search, databases]
excerpt: Before reaching for Elasticsearch, try Postgres full-text search. For most applications it's fast enough, much simpler to operate, and already in your stack.
difficulty: 3
---

The typical path is: application needs search → reach for Elasticsearch or Typesense → spend two weeks on infrastructure. For most applications that's the wrong trade-off. Postgres full-text search handles a surprising amount of load and costs nothing extra to operate.

## How it works

Postgres converts text to a `tsvector` — a sorted list of normalised lexemes (word stems with position information stripped). Queries are expressed as `tsquery` values, which are boolean combinations of lexemes.

```sql
SELECT to_tsvector('english', 'The quick brown fox jumped over the lazy dog');
-- 'brown':3 'dog':9 'fox':4 'jump':5 'lazi':8 'quick':2

SELECT to_tsquery('english', 'jumping & fox');
-- 'jump' & 'fox'
```

Note that `jumping` is normalised to `jump` and `The`, `over`, `the` are dropped as stop words. The query matches because both lexemes appear in the vector.

## Basic search

```sql
SELECT title, body
FROM posts
WHERE to_tsvector('english', title || ' ' || body) @@ to_tsquery('english', 'postgres & search')
ORDER BY ts_rank(
  to_tsvector('english', title || ' ' || body),
  to_tsquery('english', 'postgres & search')
) DESC;
```

`@@` is the match operator. `ts_rank` scores matches by how frequently and prominently the terms appear.

## Adding an index

Computing `to_tsvector` on every query is slow. Store it in a generated column and index it.

```sql
ALTER TABLE posts
  ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(body, '')), 'B')
  ) STORED;

CREATE INDEX posts_search_idx ON posts USING GIN (search_vector);
```

`setweight` assigns label `A` (highest) to title matches and `B` to body matches. This makes title matches rank higher than body matches. The GIN index makes lookups fast.

Now the query simplifies to:

```sql
SELECT title, ts_rank(search_vector, query) AS rank
FROM posts, to_tsquery('english', 'postgres & search') query
WHERE search_vector @@ query
ORDER BY rank DESC
LIMIT 20;
```

## Phrase search and prefix matching

Phrase search uses the `<->` distance operator:

```sql
-- matches "full text" as adjacent words
SELECT * FROM posts WHERE search_vector @@ to_tsquery('english', 'full <-> text');
```

Prefix matching (for autocomplete) uses `:*`:

```sql
-- matches "postgres", "postgresql", "postgreSQL"
SELECT * FROM posts WHERE search_vector @@ to_tsquery('english', 'postgr:*');
```

## Highlighting results

`ts_headline` wraps matched terms in HTML for display:

```sql
SELECT
  title,
  ts_headline(
    'english',
    body,
    to_tsquery('english', 'postgres & search'),
    'MaxWords=30, MinWords=15, StartSel=<mark>, StopSel=</mark>'
  ) AS excerpt
FROM posts
WHERE search_vector @@ to_tsquery('english', 'postgres & search');
```

## When to graduate to a dedicated search engine

Postgres full-text search is not the right tool when:

- You need fuzzy matching (typo tolerance) — `pg_trgm` helps but dedicated engines do this better
- Your search index spans multiple tables or services
- You need faceted search with aggregations at scale
- Query latency becomes a bottleneck and you've exhausted index tuning

For a single-service application with a few million rows, Postgres is almost certainly sufficient and dramatically simpler to operate than a separate search cluster.
