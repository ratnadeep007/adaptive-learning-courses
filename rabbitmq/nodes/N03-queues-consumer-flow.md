---
id: N03
status: mastered
prerequisites: [N01]
next-review: 2026-08-31
---

# Queues and Consumer Flow

## Objective
Choose a queue's lifecycle and delivery flow, including durable topology, queue type, competing consumers, and bounded prefetch.

## Why it matters
Queues buffer work between producers and consumers; queue choice and consumer credit control reliability, ordering, and resource use.

## Mental model
A queue is a broker-owned work backlog. Consumers borrow deliveries from it; prefetch is the maximum number each consumer may hold before returning credit with acknowledgements.

## Explanation
Queues are generally FIFO, but multiple consumers, requeues, and priorities change observed order. Durable queue metadata plus persistent messages are both needed to retain messages across a broker restart. Competing consumers share work from one queue; a second queue bound to the same exchange gets its own copy. Use manual acknowledgements and bounded prefetch to cap in-flight work. Queue declarations must remain property-equivalent; changing immutable declaration arguments requires a migration strategy.

## Worked example
`orders.billing` has three workers with prefetch 10. At most 30 deliveries can be unacknowledged across them. A fourth analytics queue bound to the same event exchange receives an independent copy, not a share of the billing queue's work.

## Common misconceptions
- Two consumers of one queue compete; they do not each receive every message.
- Durable queues alone do not preserve transient messages across a restart.
- FIFO does not imply end-to-end processing order with concurrent consumers or redelivery.

## Misconception log
| Date | Question | Learner answer | Why it failed | Follow-up question | Status |
|---|---|---|---|---|---|
| 2026-08-30 | Broker-restart durability | A durable queue alone preserves every message | Queue durability and message persistence are separate; a transient message is discarded during recovery | Compared a restart scenario and correctly separated both protections | resolved |

## Retrieval questions
- Predict distribution with two consumers and two queues.
- Choose prefetch for a handler that calls a slow external service.

## Connections
- Prerequisites: [[N01-connections-channels-topology]].
- Enables: [[N04-acknowledgements-confirms-idempotency]], [[N07-priority-lazy-queues]], [[N08-javascript-typescript-python-clients]].
- Knowledge base: [[knowledge-base]].

## Sources
- [RabbitMQ Queues](https://www.rabbitmq.com/docs/queues)
- [Consumer Acknowledgements and Publisher Confirms](https://www.rabbitmq.com/docs/confirms)