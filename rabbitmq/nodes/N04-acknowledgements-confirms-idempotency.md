---
id: N04
status: mastered
prerequisites: [N03]
next-review: 2026-08-31
---



# Acknowledgements, Confirms, and Idempotency

## Objective
Place acknowledgements and publisher confirms correctly, then make a consumer safe when delivery is repeated.

## Why it matters
RabbitMQ can confirm broker receipt and consumer processing, but neither turns a non-idempotent business operation into exactly-once processing.

## Mental model
Publisher confirms are a receipt from the broker; consumer acknowledgements are a receipt from the handler. A network failure can lose either receipt, so the sender or broker may retry.

## Explanation
Publisher confirms cover publisher-to-broker acceptance; consumer acknowledgements cover broker-to-consumer processing and are independent. With manual acknowledgement, a connection loss before `ack` permits redelivery. Acknowledge only after the required durable side effect succeeds. Make the effect idempotent using a stable message or business-operation ID, transactional uniqueness, or an inbox table. `nack` or `reject` chooses requeueing or terminal failure; unbounded requeueing can create a hot loop.

## Worked example
A consumer records `paymentId` in a database table with a unique constraint, charges only if the insert succeeds, then acknowledges. If the process dies after the database commit but before `ack`, redelivery finds the existing ID and safely acknowledges without charging twice.

## Common misconceptions
- Publisher confirms do not tell a producer that a consumer processed a message.
- An `ack` before the side effect trades duplicates for lost work.
- At-least-once delivery requires idempotent application behavior.

## Misconception log
| Date | Question | Learner answer | Why it failed | Follow-up question | Status |
|---|---|---|---|---|---|
| 2026-08-30 | Producer lost its publisher-confirm outcome | Consumer acknowledgements prove the command was processed | Consumer acknowledgements are independent of publisher-to-broker acceptance and cannot establish this publisher's outcome | Distinguish an uncertain publish from a completed consumer side effect | resolved |
| 2026-08-30 | Inventory publisher disconnected before confirmation | Related consumer activity proves this publication was accepted and processed | Other consumer activity does not identify or establish the outcome of this publisher's specific transmission | Decide what evidence settles a publisher-to-broker acceptance outcome | resolved |

## Retrieval questions
- Place `ack` around a database side effect and justify it.
- Explain why a timeout after publishing can require retry despite publisher confirms.

## Connections
- Prerequisites: [[N03-queues-consumer-flow]].
- Enables: [[N05-retries-dlx-dlq]], [[N08-javascript-typescript-python-clients]].
- Knowledge base: [[knowledge-base]].

## Sources
- [Consumer Acknowledgements and Publisher Confirms](https://www.rabbitmq.com/docs/confirms)