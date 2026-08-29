---
id: N08
status: mastered
prerequisites: [N04, N06]
next-review: 2026-08-20
---

# End-to-end design

## Objective
Design a Bloom-filter-backed lookup path with explicit correctness and capacity constraints.

## Why it matters
This synthesis separates the approximate prefilter from the source of truth.

## Mental model
Specify a gate, its error budget, and the authoritative path behind it.

## Explanation
Define the authoritative membership store, expected cardinality, target false-positive rate, update/deletion semantics, rebuild or scaling policy, and behavior when the filter is unavailable. Preserve correctness by treating negatives as safe skips only when the filter is complete and current for the relevant set; otherwise fall back to the authoritative lookup.

## Worked example
For an immutable segment index, create one filter per segment, size each for its record count, and consult it before opening the segment. For a possibly stale filter, use it only as a hint where a false negative cannot cause missed data.

## Common misconceptions
- A stale or incomplete filter may invalidate the safe-negative guarantee.
- A target false-positive rate does not replace capacity monitoring.

## Misconception log
| Date | Question | Learner answer | Why it failed | Follow-up question | Status |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

## Retrieval questions
- Which conditions make a negative safe to trust?
- Design a fallback when the filter cannot be trusted.

## Connections
- Prerequisites: [[N04-parameter-sizing]], [[N06-operational-trade-offs]]
- Enables: final synthesis

## Related
- [[knowledge-base|Comprehensive Knowledge Base]]