---
id: N01
status: mastered
prerequisites: []
next-review: 2026-09-02
---

# Connections, Channels, and Topology

## Objective
Explain why a client uses one TCP connection with multiple channels and declare the topology before publishing or consuming.

## Why it matters
Confusing a channel with a queue leads to incorrect lifetime, concurrency, and acknowledgement assumptions.

## Mental model
A connection is the network cable to a broker; a channel is a lightweight, independent conversation carried over that cable. Exchanges, queues, and bindings are the broker's durable routing map, not objects owned by a client process.

## Explanation
A producer or consumer first opens a connection, then opens one or more channels. Most AMQP operations occur on a channel, including declares, publishes, consumes, and acknowledgements. A channel failure does not make it a queue; it invalidates channel-scoped operations such as delivery tags. Applications declare their intended exchanges, queues, and bindings idempotently so startup order does not matter; an incompatible redeclaration is a configuration error.

## Worked example
An order service opens one connection, creates a publishing channel and a consuming channel, declares `orders.events` and `orders.billing`, then binds the queue before either service starts. Publishing `order.created` travels through the exchange; the consumer receives from the queue on its own channel.

## Common misconceptions
- A channel is not a queue and does not store messages.
- A direct publish to a queue still uses RabbitMQ's default exchange.
- Reusing a channel across unrelated concurrent tasks can make delivery and error handling unsafe.

## Misconception log
| Date | Question | Learner answer | Why it failed | Follow-up question | Status |
|---|---|---|---|---|---|

## Retrieval questions
- Distinguish connection, channel, exchange, queue, binding, producer, and consumer.
- Describe which parts survive a client restart when declared durable.

## Connections
- Prerequisites: none.
- Enables: [[N02-exchanges-bindings-routing]], [[N03-queues-consumer-flow]], [[N08-javascript-typescript-python-clients]].
- Knowledge base: [[knowledge-base]].

## Sources
- [RabbitMQ Exchanges](https://www.rabbitmq.com/docs/exchanges)
- [RabbitMQ Queues](https://www.rabbitmq.com/docs/queues)