---
id: N05
status: mastered
prerequisites: [N02]
next-review: 2026-08-20
---

# Insertion and query algorithms

## Objective
State correct insertion and query algorithms and their time and space costs.

## Why it matters
Correct implementation preserves the one-sided guarantee.

## Mental model
Insertion is bitwise OR across $k$ positions; query is bitwise AND of the claim that every position is set.

## Explanation
Insert: compute $k$ positions and set each bit. Query: compute the same positions; return absent immediately upon a 0 bit, otherwise possibly present. Each operation takes $O(k)$ hash/bit operations and the structure occupies $m$ bits.

## Worked example
For query positions 2, 5, 9, inspect 2 first. If it is 0, stop: no later position can make the item present.

## Common misconceptions
- Clearing a bit on deletion can create false negatives for other items.
- Insert and query must use the same hashing and position mapping.

## Misconception log
| Date | Question | Learner answer | Why it failed | Follow-up question | Status |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

## Retrieval questions
- Why may query short-circuit but insertion may not?
- What breaks if hashes differ between insert and query?

## Connections
- Prerequisites: [[N02-bits-and-hash-positions]]
- Enables: [[N06-operational-trade-offs]]

## Related
- [[knowledge-base|Comprehensive Knowledge Base]]