---
id: N07
status: mastered
prerequisites: [N06]
next-review: 2026-09-09
---

# Variants and deletion

## Objective
Explain why ordinary Bloom filters cannot delete safely and identify suitable variants.

## Why it matters
Workloads with removals require a design that preserves one-sided correctness.

## Mental model
A plain bit cannot record who set it; a counter can record how many active items contributed.

## Explanation
Clearing a bit for one removed item may erase evidence still needed by another, creating a false negative. A counting Bloom filter replaces bits with small counters: insert increments and delete decrements each selected counter. Scalable filters add layers as the set grows; other variants trade additional memory or complexity for different capabilities.

## Worked example
If `cat` and `dog` both set position 4, deleting `cat` must not clear 4 while `dog` remains. A counter preserves that distinction.

## Common misconceptions
- Counting filters still can have false positives.
- Deletion safety depends on removing only items known to have been inserted.

## Misconception log
| Date | Question | Learner answer | Why it failed | Follow-up question | Status |
|---|---|---|---|---|---|
| 2026-08-17 | Deletion from counters {2, 1, 3} | Leave counters unchanged | Retains the removed key's contributions, so active-set representation is stale. | Counter deletion scenario with shared and unshared positions | resolved |
| 2026-08-17 | Property of counting Bloom filters | Counters require no extra memory | A counter holds more states than a bit, so it necessarily needs additional storage. | Identify the cost introduced by counter cells | resolved |
| 2026-08-17 | Shared-counter deletion follow-up | Clear all selected counters | Erases contributions from other live keys at positions whose counts exceed one. | Different shared-counter removal scenario | resolved |

## Retrieval questions
- Why is a bit insufficient for deletion?
- What new failure/cost does a counter-based filter introduce?

## Connections
- Prerequisites: [[N06-operational-trade-offs]]
- Enables: [[N08-end-to-end-design]]

## Related
- [[knowledge-base|Comprehensive Knowledge Base]]