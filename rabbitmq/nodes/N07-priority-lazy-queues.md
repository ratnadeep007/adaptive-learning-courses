---
id: N07
status: mastered
prerequisites: [N03]
next-review: 2026-09-02
---

# Priority and Lazy Queues

## Objective
Decide when queue priority is justified and explain why the former lazy-queue mode is not a current configuration choice.

## Why it matters
Priorities complicate fairness and ordering; obsolete lazy-queue configuration can create false expectations during upgrades.

## Mental model
A priority queue is several priority lanes sharing one queue. It only chooses among messages still waiting at the broker, not messages already delivered to consumers.

## Explanation
Priority queues deliver higher-priority ready messages before lower-priority messages, subject to prefetch and redelivery behavior. Classic queues require `x-max-priority` at declaration; use only a low single-digit range because each level has resource cost. In RabbitMQ 4.3, quorum queues expose 32 strict levels. Prefer separate queues per service class when you need simple isolation or fairness. RabbitMQ no longer supports the historical classic `x-queue-mode=lazy`: since 3.12 it is ignored, and current classic queues already use disk with a small in-memory working set.

## Worked example
A support system has interactive and batch work. First use `support.interactive` and `support.batch` queues with separate worker capacity. Use a priority queue only when both classes must share a worker pool and you accept that sustained high-priority traffic can delay lower-priority work.

## Common misconceptions
- Priority does not preempt a message already delivered under consumer prefetch.
- Priority is not a substitute for capacity isolation or retry design.
- `x-queue-mode=lazy` does not create a lazy queue on current RabbitMQ.

## Misconception log
| Date | Question | Learner answer | Why it failed | Follow-up question | Status |
|---|---|---|---|---|---|

## Retrieval questions
- Decide whether to use one priority queue or two queues for a workload.
- Predict what happens when a high-priority message arrives after prefetch is full.

## Connections
- Prerequisites: [[N03-queues-consumer-flow]].
- Enables: [[N09-reliable-workflow-design]].
- Knowledge base: [[knowledge-base]].

## Sources
- [Priority Support in Queues](https://www.rabbitmq.com/docs/priority)
- [Classic Queues Operating in "Lazy" Queue Mode](https://www.rabbitmq.com/docs/lazy-queues)