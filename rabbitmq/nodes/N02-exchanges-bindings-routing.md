---
id: N02
status: mastered
prerequisites: [N01]
next-review: 2026-09-02
---

# Exchanges, Bindings, and Routing

## Objective
Choose direct, topic, fanout, or headers routing by stating exactly which messages each binding receives.

## Why it matters
Exchange type and binding keys define the contract between publishers and consumers without coupling publishers to queue names.

## Mental model
An exchange is a routing table. A binding is one row that connects a destination and an optional matching rule. A routing key is the lookup value supplied by a publisher.

## Explanation
A direct exchange uses exact routing-key equality. A topic exchange matches dot-separated words: `*` matches one word and `#` matches zero or more. A fanout exchange sends a copy to every bound destination and ignores the routing key. A headers exchange matches message headers. The default exchange is a special direct exchange: publishing with an empty exchange name and a queue name as routing key reaches that queue through its automatic binding.

## Worked example
Publish `billing.invoice.paid` to a topic exchange. A `billing.#` binding receives it; `billing.*.paid` receives it; `billing.invoice` does not. A separate audit queue bound with `#` receives every event.

## Common misconceptions
- A topic is an exchange type, not a persistent log of subscribers.
- `#` can match no words; `*` must match exactly one word.
- Fanout does not balance work: it duplicates messages to every binding.

## Misconception log
| Date | Question | Learner answer | Why it failed | Follow-up question | Status |
|---|---|---|---|---|---|

## Retrieval questions
- Given bindings and a routing key, predict every destination.
- Select the smallest exchange contract for an event-routing requirement.

## Connections
- Prerequisites: [[N01-connections-channels-topology]].
- Enables: [[N08-javascript-typescript-python-clients]].
- Knowledge base: [[knowledge-base]].

## Sources
- [RabbitMQ Exchanges](https://www.rabbitmq.com/docs/exchanges)