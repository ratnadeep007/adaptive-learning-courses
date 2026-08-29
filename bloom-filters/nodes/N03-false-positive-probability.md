---
id: N03
status: mastered
prerequisites: [N02]
next-review: 2026-08-18
---

# False-positive probability

## Objective
Estimate how bit occupancy determines a Bloom filter’s false-positive rate.

## Why it matters
False positives are the main cost paid for saving memory and lookups.

## Mental model
A false positive requires every one of a query’s $k$ chosen lights to already be on.

## Explanation
After inserting $n$ items into $m$ bits with $k$ hashes, the probability a bit remains 0 is approximately $(1-1/m)^{kn}\approx e^{-kn/m}$. Thus the false-positive rate is approximately $p=(1-e^{-kn/m})^k$.

## Worked example
If bits are nearly all on, almost every query appears present. If too few bits are on, a query commonly finds a 0 and returns absent.

## Common misconceptions
- The rate depends on both inserted count and bit budget.
- More hashes are not always better.

## Misconception log
| Date | Question | Learner answer | Why it failed | Follow-up question | Status |
|---|---|---|---|---|---|
| 2026-08-17 | Can a larger k worsen false-positive rate at fixed m and n? | It cannot make them worse | Missed that extra positions per insertion can overfill a fixed bit array. | Effect of many positions after repeated insertions | resolved |

## Retrieval questions
- Why does higher occupancy increase false positives?
- What happens to $p$ when $n$ rises while $m$ and $k$ stay fixed?

## Connections
- Prerequisites: [[N02-bits-and-hash-positions]]
- Enables: [[N04-parameter-sizing]]

## Related
- [[knowledge-base|Comprehensive Knowledge Base]]