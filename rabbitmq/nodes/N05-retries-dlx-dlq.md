---
id: N05
status: mastered
prerequisites: [N04]
next-review: 2026-09-02
---

# Retries, DLX, and DLQ

## Objective
Design bounded retries and a diagnosable dead-letter path without creating a requeue or dead-letter cycle.

## Why it matters
Poison messages otherwise consume workers repeatedly, hide application faults, and can exhaust broker resources.

## Mental model
A dead-letter exchange (DLX) is an ordinary exchange selected by a source queue when a message is rejected without requeue, expires, exceeds a length limit, or reaches a quorum-queue delivery limit. A dead-letter queue (DLQ) is simply a queue bound to that DLX.

## Explanation
Use bounded attempts and an explicit terminal route. A consumer can `nack` with `requeue=false` to dead-letter immediately; TTL can move a message through a retry queue before it returns to work. Inspect the `x-death` history when deciding whether to retry or park. Prefer broker policies for configurable DLX and TTL settings, because hardcoded queue arguments require application redeployment and often queue replacement to change. DLX publication can fail; it is not an unlimited durability guarantee.

## Worked example
`orders.work` dead-letters rejected messages to `orders.retry`. The retry queue has a five-minute TTL and dead-letters back to `orders.events` with `order.retry`. After three observed deaths, the handler rejects without requeue to route the message to `orders.dlq` for investigation.

## Common misconceptions
- A DLQ is not a special queue type.
- Requeueing the same failing message is not a retry policy.
- A DLX target must have a valid route when the message dead-letters.

## Misconception log
| Date | Question | Learner answer | Why it failed | Follow-up question | Status |
|---|---|---|---|---|---|

## Retrieval questions
- Trace a rejected message through a retry queue and DLQ.
- Identify a cycle in a DLX topology and remove it.

## Connections
- Prerequisites: [[N04-acknowledgements-confirms-idempotency]].
- Enables: [[N06-delayed-delivery]], [[N08-javascript-typescript-python-clients]], [[N09-reliable-workflow-design]].
- Knowledge base: [[knowledge-base]].

## Sources
- [Dead Letter Exchanges](https://www.rabbitmq.com/docs/dlx)
- [Time-to-Live and Expiration](https://www.rabbitmq.com/docs/ttl)