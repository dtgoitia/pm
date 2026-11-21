---
id: F-0005
title: Navigate ticket graph in interactive TUI
type: feature
status: idea
created: 2026-11-21T17:45:47+01:00
related_to: []
blocks: [F-0003, F-0004]
blocked_by: [F-0001]
supersedes: []
superseded_by: []
---

## Problem

## Proposed behaviour

The ticket graph printed by [F-0001](F-0001-print-dependency-graph-of-markdown-tickets.md) is shown as an interactive TUI, in which the user moves between tickets with `j` (down) and `k` (up). Other actions, such as folding, jumping to a ticket or opening its file, are out of scope here.

## Acceptance criteria

- [ ] In the graph view, `j` moves to the next ticket down and `k` to the next ticket up, following vim's convention.
- [ ] In the graph view, the cursor is represented by slightly changing the background color of the line where the cursor is
- [ ] In the graph view, `}` moves to the next root ticket down and `{` to the previous root ticket up, following vim's convention.

## Open questions

<!-- what keeps this item at "clarifying" -->

- The cursor (background colour of the current row) and root navigation (`{` / `}`) appear in the acceptance criteria but not in _Proposed behaviour_, and the out-of-scope sentence ("jumping to a ticket") contradicts `{` / `}`. Sync _Proposed behaviour_ with the criteria.
- How does the user open the TUI (command or flag)?

## Notes / history

- 2026-11-21: Split out of F-0001, which now only prints the graph. Colours are used only in the TUI; the printed graph never uses them.
