---
id: N06
status: mastered
prerequisites: [N04, N05]
next-review: 2026-09-09
---

# Operational trade-offs

## Objective
Decide when a Bloom filter is appropriate and where it belongs in a system path.

## Why it matters
A false-positive-tolerant prefilter helps only when negative checks avoid meaningful downstream cost.

## Mental model
It is a cheap front desk before an authoritative, costly back office.

## Explanation
Use it when many queries are negative and the authoritative check is costly (disk, network, or computation). A positive must still be validated. Budget memory, target false-positive rate, expected growth, rebuild strategy, and observability of occupancy or observed positive verification rate.

## Worked example
A database client can avoid network reads for keys the filter definitively rejects; a reported hit still goes to the database.

## Common misconceptions
- It does not improve correctness; it improves expected cost.
- A high false-positive rate can turn it into pure overhead.

## Misconception log
| Date | Question | Learner answer | Why it failed | Follow-up question | Status |
|---|---|---|---|---|---|
| 2026-08-17 | Can a stale filter safely skip current lookup on a negative? | Treat it as definitive absence | Assumed every negative is safe; the filter omitted recent records. | A yesterday-only inventory queried for today's records | resolved |

## Retrieval questions
- What workload shape benefits most?
- What must be authoritative after a positive result?

## Connections
- Prerequisites: [[N04-parameter-sizing]], [[N05-insertion-and-query-algorithms]]
- Enables: [[N07-variants-and-deletion]], [[N08-end-to-end-design]]

## Related
- [[knowledge-base|Comprehensive Knowledge Base]]