---
title: Understanding Go's Memory Model
date: 2025-11-04 09:00:00
categories: [Systems]
tags: [go, concurrency, memory]
excerpt: The Go memory model defines when one goroutine is guaranteed to see writes made by another. Getting this wrong leads to races that only show up in production under load.
---

The Go memory model is one of those things you can ignore for a long time — until you can't. Most concurrent Go code works by convention rather than by proof. Understanding what the runtime actually guarantees helps you reason about the cases where convention breaks down.

## The happens-before relation

The model is built around one concept: *happens-before*. If event A happens-before event B, then B is guaranteed to observe all memory writes performed before or during A.

Within a single goroutine, everything happens in source order. Across goroutines, the only happens-before edges are created by explicit synchronisation: channel sends and receives, `sync.Mutex` lock and unlock, `sync.WaitGroup`, and a handful of others.

If two goroutines access the same variable without synchronisation, and at least one access is a write, you have a data race. The result is undefined — not "probably fine", undefined.

## What the race detector catches

Go's built-in race detector instruments memory accesses at compile time and reports unsynchronised concurrent accesses at runtime.

```bash
go test -race ./...
go run -race main.go
```

Run with `-race` in CI. It has roughly 2–20× overhead so you don't want it in production, but it's invaluable during development. A clean `-race` run is not a proof of correctness, but it catches a large class of bugs.

## Channel semantics

A send on a channel happens-before the corresponding receive completes. A receive from a closed channel happens-after the close.

```go
var data []int
done := make(chan struct{})

go func() {
    data = compute() // write
    close(done)      // happens-before...
}()

<-done               // ...this receive
fmt.Println(data)   // safe to read here
```

The close-then-receive pattern is idiomatic for signalling completion. The channel is the synchronisation point.

## sync.Once

`sync.Once` is the canonical way to initialise something exactly once, safely.

```go
var (
    instance *Client
    once     sync.Once
)

func GetClient() *Client {
    once.Do(func() {
        instance = newClient()
    })
    return instance
}
```

The function passed to `Do` happens-before any call to `Do` returns. All callers block until the first invocation completes, then all receive the same `instance`.

## Atomic operations

`sync/atomic` provides load/store operations that are safe to use concurrently without a mutex.

```go
var counter int64

// safe from multiple goroutines
atomic.AddInt64(&counter, 1)
n := atomic.LoadInt64(&counter)
```

Atomics are lower overhead than mutexes but they only synchronise the specific variable, not surrounding reads and writes. They're suited for counters and flags, not for protecting compound state.

## The pattern I reach for first

When in doubt, reach for a mutex. The overhead is rarely the bottleneck and the correctness model is simple: hold the lock while reading or writing shared state.

```go
type Store struct {
    mu   sync.RWMutex
    data map[string]string
}

func (s *Store) Get(key string) (string, bool) {
    s.mu.RLock()
    defer s.mu.RUnlock()
    v, ok := s.data[key]
    return v, ok
}

func (s *Store) Set(key, value string) {
    s.mu.Lock()
    defer s.mu.Unlock()
    s.data[key] = value
}
```

`sync.RWMutex` allows multiple concurrent readers or one writer. Use it when reads significantly outnumber writes.

## Further reading

The [Go memory model specification](https://go.dev/ref/mem) is short and worth reading in full. The [race detector documentation](https://go.dev/doc/articles/race_detector) covers how to integrate it into your workflow.
