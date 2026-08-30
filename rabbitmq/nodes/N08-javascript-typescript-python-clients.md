---
id: N08
status: mastered
prerequisites: [N02, N03, N04, N05]
next-review: 2026-09-02
---

# JavaScript, TypeScript, and Python Clients

## Objective
Implement the same durable, manually acknowledged producer and consumer topology with amqplib in JavaScript/TypeScript and Pika in Python.

## Why it matters
Client API calls only make sense when they express the routing, acknowledgement, and idempotency contract already designed.

## Mental model
The client library maps AMQP verbs to code: connect, open channel, declare topology, publish or consume, then confirm or acknowledge at the correct boundary.

## Explanation
The RabbitMQ JavaScript tutorials use `amqplib`: `connect`, `createChannel`, `assertExchange`, `assertQueue`, `bindQueue`, `publish`, `consume`, `ack`, and `nack`. The Python tutorials use Pika's `BlockingConnection`, `channel`, `exchange_declare`, `queue_declare`, `queue_bind`, `basic_publish`, `basic_consume`, and `basic_ack`. Encode payloads explicitly, use one declared topology contract in both producer and consumer, set `noAck: false`/`auto_ack=False` for reliable work, bound prefetch, and acknowledge only after the side effect succeeds.

## Worked example
TypeScript topology setup:
```ts
const connection = await amqp.connect(url);
const channel = await connection.createChannel();
await channel.assertExchange('orders.events', 'topic', { durable: true });
await channel.assertQueue('orders.billing', { durable: true });
await channel.bindQueue('orders.billing', 'orders.events', 'order.created');
await channel.prefetch(10);
channel.consume('orders.billing', async message => {
  if (!message) return;
  try {
    await handleOnce(JSON.parse(message.content.toString()));
    channel.ack(message);
  } catch (error) {
    channel.nack(message, false, false);
  }
}, { noAck: false });
```
The equivalent Pika consumer calls `basic_qos(prefetch_count=10)`, registers `basic_consume(auto_ack=False, on_message_callback=...)`, performs the idempotent handler, then calls `basic_ack(delivery_tag=method.delivery_tag)` or `basic_nack(..., requeue=False)`.

## Common misconceptions
- Declaring a queue does not make a publish durable; use the required message/publisher-confirm strategy too.
- `sendToQueue` uses the default exchange; it does not bypass exchange routing.
- `async` callbacks need an explicit error boundary so failed messages are not accidentally acknowledged.

## Misconception log
| Date | Question | Learner answer | Why it failed | Follow-up question | Status |
|---|---|---|---|---|---|

## Retrieval questions
- Complete a consumer that acknowledges only after an idempotent write.
- Translate a topic exchange topology from amqplib to Pika.

## Connections
- Prerequisites: [[N02-exchanges-bindings-routing]], [[N03-queues-consumer-flow]], [[N04-acknowledgements-confirms-idempotency]], [[N05-retries-dlx-dlq]].
- Enables: [[N09-reliable-workflow-design]].
- Knowledge base: [[knowledge-base]].

## Sources
- [RabbitMQ JavaScript tutorial](https://www.rabbitmq.com/tutorials/tutorial-one-javascript)
- [RabbitMQ Python tutorial](https://www.rabbitmq.com/tutorials/tutorial-one-python)
- [Consumer Acknowledgements and Publisher Confirms](https://www.rabbitmq.com/docs/confirms)