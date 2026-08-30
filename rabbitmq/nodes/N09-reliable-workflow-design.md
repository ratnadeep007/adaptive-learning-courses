---
id: N09
status: mastered
prerequisites: [N05, N06, N07, N08]
next-review: 2026-09-02
---

# Reliable Workflow Design

## Objective
Design and defend a complete RabbitMQ workflow from publish through normal processing, retry, delay, dead-lettering, and operations visibility.

## Why it matters
A topology is correct only when its failure paths, capacity limits, and duplicate behavior are as explicit as its happy path.

## Mental model
Treat each message path as a state machine: published, ready, in-flight, completed, retry-waiting, or parked for diagnosis. Every transition needs an owner and a reason.

## Explanation
Start with the message contract and routing keys, then declare exchanges, queues, and bindings. Decide what acknowledgement proves, how duplicate side effects are prevented, how many retries are allowed, which delay tiers apply, and where terminal failures go. Choose priority only for a demonstrated scheduling need; use separate queues when isolation is clearer. Instrument queue depth, unacknowledged deliveries, redeliveries, retry/DLQ volume, and handler latency. Test consumer crash, malformed payload, downstream outage, and broker restart paths.

## Worked example
For `invoice.created`, publish to `billing.events` with `invoice.created`. `billing.work` consumes with prefetch 10 and records an idempotency key before calling the payment service. Transient outages enter 30-second then 5-minute retry queues; a third failure routes to `billing.dlq` with `x-death` metadata. Metrics alert on retry growth and DLQ arrivals; a replay tool republishes only after an operator fixes the cause.

## Common misconceptions
- A DLQ is not an automated recovery plan; it needs ownership and replay rules.
- Broker durability does not replace idempotent business handling.
- More consumers and larger prefetch do not automatically improve a downstream-bound workflow.

## Misconception log
| Date | Question | Learner answer | Why it failed | Follow-up question | Status |
|---|---|---|---|---|---|

## Retrieval questions
- Produce a topology diagram and state machine for a payment workflow.
- Diagnose an unbounded retry loop using broker evidence.

## Connections
- Prerequisites: [[N05-retries-dlx-dlq]], [[N06-delayed-delivery]], [[N07-priority-lazy-queues]], [[N08-javascript-typescript-python-clients]].
- Enables: final synthesis.
- Knowledge base: [[knowledge-base]].

## Sources
- [RabbitMQ Reliability](https://www.rabbitmq.com/docs/reliability)
- [Dead Letter Exchanges](https://www.rabbitmq.com/docs/dlx)
- [Priority Support in Queues](https://www.rabbitmq.com/docs/priority)