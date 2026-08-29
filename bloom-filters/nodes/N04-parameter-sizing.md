---
id: N04
status: mastered
prerequisites: [N03]
next-review: 2026-08-20
---

# Parameter sizing

## Objective
Select bit count and hash count from an expected item count and target false-positive rate.

## Why it matters
Sizing turns a useful idea into a predictable operational contract.

## Mental model
Memory buys lower occupancy; the hash count balances how thoroughly each item marks the board against making it too full.

## Explanation
For expected $n$ items and target rate $p$, use approximately $m=-n\ln p/(\ln2)^2$ bits and $k=(m/n)\ln2$ hash positions, rounded sensibly. The optimal $k$ is near the point where about half the bits are set.

## Worked example
A target rate is a budget for unnecessary authoritative lookups. If the actual item count exceeds the design count, the false-positive rate rises; resize or layer a new filter before that cost is unacceptable.

## Common misconceptions
- A target rate is not guaranteed exact for every finite run.
- The expected cardinality must be supplied or estimated.

## Misconception log
| Date | Question | Learner answer | Why it failed | Follow-up question | Status |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

## Retrieval questions
- Which inputs determine $m$?
- Why is overshooting $k$ harmful?

## Connections
- Prerequisites: [[N03-false-positive-probability]]
- Enables: [[N06-operational-trade-offs]], [[N08-end-to-end-design]]

## Related
- [[knowledge-base|Comprehensive Knowledge Base]]