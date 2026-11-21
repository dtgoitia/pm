---
id: F-0006
title: Fix ticket graph integrity problems
type: feature
status: idea
created: 2026-11-21T18:01:56+01:00
related_to: []
blocks: []
blocked_by: [F-0002]
supersedes: []
superseded_by: []
---

## Problem

## Proposed behaviour

The user can fix the integrity problems that [F-0002](F-0002-check-ticket-graph-integrity.md) detects.

- A ticket that lists itself in its own `blocks` or `blocked_by` is fixed by removing the self-reference.

## Acceptance criteria

## Open questions

<!-- what keeps this item at "clarifying" -->

- What does "fix" mean for each problem? Some have an obvious fix (add the missing side of a one-sided `blocks`/`blocked_by` link; remove a link to an ID that doesn't exist); others don't (cycles, duplicate IDs, invalid statuses, partial tickets). Options: (a) `pm check --fix` applies only the obvious fixes and reports the rest; (b) ask before each fix.
- When `blocks` and `blocked_by` disagree, is adding the missing side always right, or could the existing side be the stale one?

## Notes / history

- 2026-11-21: Split out of F-0002, which now only detects problems.
