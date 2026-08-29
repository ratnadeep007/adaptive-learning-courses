---
id: N02
status: mastered
prerequisites: [N01]
next-review: 2026-08-18
---

# Bits and hash positions

## Objective
Trace how a value maps to bit positions during insertion and membership queries.

## Why it matters
The exact bit-level mechanism explains both speed and false positives.

## Mental model
Think of an $m$-cell light board. Each of $k$ independent hash functions points at one cell. Insertion turns those cells on; a query asks whether every pointed cell is on.

## Explanation
For value $x$, hashes $h_1(x),\ldots,h_k(x)$ map to positions in $[0,m)$. Insert sets all selected bits to 1. Query returns `absent` on the first 0 bit; otherwise it returns `possibly present`. The filter stores bits, not values or hash outputs.

## Worked example
With $m=10$, $k=3$, inserting `cat` might set positions 1, 4, 8. Querying `dog` at 1, 4, 6 is definitely absent because bit 6 is 0. If its positions were 1, 4, 8, it would be a possible false positive.

## Common misconceptions
- Hash outputs are not stored as entries.
- A query needs all bits set, not merely one.
- Hash functions should distribute positions uniformly; independent behavior is the useful model.

## Misconception log
| Date | Question | Learner answer | Why it failed | Follow-up question | Status |
|---|---|---|---|---|---|
| 2026-08-17 | Query positions 1, 4, 6 with bit 6 unset | Possibly present | Treated two set positions as sufficient; every queried bit must be set for a possible positive. | A query with one zero among positions 2, 5, 9 | resolved |

## Retrieval questions
- Why does one queried 0 bit prove absence?
- What information is lost once several values set overlapping bits?

## Connections
- Prerequisites: [[N01-membership-guarantees]]
- Enables: [[N03-false-positive-probability]], [[N05-insertion-and-query-algorithms]]

## Related
- [[knowledge-base|Comprehensive Knowledge Base]]