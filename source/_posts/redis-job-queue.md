---
title: Redis as a Job Queue
date: 2024-04-02 09:00:00
categories: [Systems]
tags: [redis, queues, background-jobs, infrastructure]
excerpt: Before standing up RabbitMQ or SQS, consider that Redis can serve as a reliable job queue for most workloads. Here's the pattern and its limits.
---

Background job processing is one of those things where the simplest approach works for a very long time. If you already have Redis in your stack, you probably don't need a separate message broker.

## The basic pattern

A job queue needs three things: a way to enqueue jobs, a way to dequeue them exactly once, and a way to track which jobs are in progress.

Redis lists give you the first two with `RPUSH` (enqueue) and `BLPOP` (blocking dequeue):

```bash
# Producer: add a job
RPUSH jobs:email '{"type":"welcome","user_id":42}'

# Consumer: block until a job is available, then pop it
BLPOP jobs:email 30  # 30 second timeout
```

`BLPOP` is atomic — only one consumer receives each job even with multiple workers.

## Reliable queue with acknowledgement

The plain `BLPOP` pattern loses jobs if a worker crashes between dequeuing and completing the job. The reliable queue pattern uses a second list as an in-progress set:

```lua
-- Atomic: move job from pending to in-progress
local job = redis.call('RPOPLPUSH', KEYS[1], KEYS[2])
return job
```

`RPOPLPUSH` atomically pops from the source list and pushes to the destination. A background process can scan the in-progress list for jobs that have been there too long and requeue them.

## Using a sorted set for scheduling

Sorted sets make it easy to schedule jobs for future execution — use the Unix timestamp as the score:

```bash
# Schedule a job for 5 minutes from now
ZADD jobs:scheduled 1735000500 '{"type":"reminder","user_id":42}'

# In a polling loop: fetch jobs ready to run
ZRANGEBYSCORE jobs:scheduled 0 <current_timestamp>
```

A scheduler process polls every few seconds, moves ready jobs to the main queue, and removes them from the sorted set.

## Practical implementation

Rather than building this from scratch, use a library built on these primitives:

- **Node.js**: [BullMQ](https://bullmq.io) — mature, actively maintained, excellent UI
- **Go**: [asynq](https://github.com/hibiken/asynq) — clean API, built-in scheduler
- **Python**: [rq](https://python-rq.org) or [Celery](https://docs.celeryq.dev) with Redis broker
- **Ruby**: [Sidekiq](https://sidekiq.org) — the de facto standard

These handle retries, delays, priorities, rate limiting, and job lifecycle management on top of the Redis primitives.

## Monitoring

At minimum, monitor:

```bash
# Queue depth — jobs waiting
LLEN jobs:email

# In-progress count
LLEN jobs:email:processing
```

BullMQ and asynq both ship with dashboards. If you're rolling your own, expose these metrics to your observability stack and alert when queue depth grows unbounded.

## When to graduate to a dedicated broker

Redis queues work well until:

- **You need durability guarantees stronger than Redis's AOF** — Kafka or SQS have different durability models
- **You have complex routing** — fanout, topic-based routing, dead-letter queues — RabbitMQ handles these better
- **Queue depth exceeds available memory** — Redis keeps everything in memory; SQS does not
- **You're already on a cloud platform** — SQS/Cloud Tasks have zero operational overhead

For most applications processing tens of thousands of jobs per hour, Redis is more than sufficient and significantly simpler to operate than a dedicated broker.
