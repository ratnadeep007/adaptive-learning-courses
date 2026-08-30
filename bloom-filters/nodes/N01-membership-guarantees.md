---
id: N01
status: mastered
prerequisites: []
next-review: 2026-09-09
---

# Membership guarantees

## Objective
Distinguish what a Bloom filter can prove from what it can only suggest.

## Why it matters
Its value comes from safely skipping expensive work after a negative result.

## Mental model
A Bloom filter is a one-sided gate: `absent` is a proof; `present` is a lead.

## Explanation
For ordinary insert-only use, an inserted element has set every bit its hashes query, so it cannot later test negative. Other elements can set all bits that an unseen element queries, causing a false positive.

## Worked example
Before a disk lookup: negative → skip the disk; positive → perform the authoritative lookup.

## Common misconceptions
- A positive result does not prove membership.
- It is not a replacement for the authoritative set.

## Misconception log
| Date | Question | Learner answer | Why it failed | Follow-up question | Status |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

## Retrieval questions
- What does each query result guarantee?
- Where can a false positive safely be tolerated?

## Connections
- Prerequisites: none
- Enables: [[N02-bits-and-hash-positions]], [[N06-operational-trade-offs]]

## Related
- [[knowledge-base|Comprehensive Knowledge Base]]