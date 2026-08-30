---
id: N06
status: mastered
prerequisites: [N05]
next-review: 2026-09-02
---

# Delayed Delivery

## Objective
Choose between TTL-plus-DLX retries, a scheduler, and the delayed-message plugin while accounting for ordering and durability limits.

## Why it matters
"Delayed queue" is not a universal RabbitMQ primitive; the right mechanism changes with delay length, volume, and recovery requirements.

## Mental model
A retry queue is a waiting room with a timer: expiry triggers dead-letter routing back to the work path. A scheduler stores an appointment separately and publishes when due.

## Explanation
For basic short retry delays, a queue-level TTL plus a DLX is the common RabbitMQ topology. Per-message TTL in one queue can suffer head-of-line behavior: an expired message behind an unexpired one may remain until it reaches the head. RabbitMQ's `rabbitmq_delayed_message_exchange` plugin accepts an `x-delay` header, but its repository says it is no longer maintained and describes major single-node and scale limits. For long-lived schedules or high delayed-message volume, use a durable scheduler/data store that publishes when due rather than treating RabbitMQ as a calendar.

## Worked example
For retry tiers of 10 seconds, 1 minute, and 10 minutes, publish failed work to three dedicated retry queues. Each queue has a fixed TTL and dead-letters back to the work exchange. This avoids mixing arbitrary per-message expirations behind one another.

## Common misconceptions
- Queue TTL controls how long an unused queue exists; message TTL controls message retention.
- A delayed exchange plugin is not the same as native, replicated scheduling.
- A delay topology still needs retry limits and a terminal failure path.

## Misconception log
| Date | Question | Learner answer | Why it failed | Follow-up question | Status |
|---|---|---|---|---|---|

## Retrieval questions
- Compare fixed retry tiers with a database-backed scheduler.
- Diagnose why a short per-message TTL was not delivered promptly.

## Connections
- Prerequisites: [[N05-retries-dlx-dlq]].
- Enables: [[N09-reliable-workflow-design]].
- Knowledge base: [[knowledge-base]].

## Sources
- [Time-to-Live and Expiration](https://www.rabbitmq.com/docs/ttl)
- [Dead Letter Exchanges](https://www.rabbitmq.com/docs/dlx)
- [RabbitMQ Delayed Message Plugin](https://github.com/rabbitmq/rabbitmq-delayed-message-exchange)