---
id: F-0001
title: Print dependency graph of markdown tickets
type: feature
status: clarifying
created: 2026-11-20T07:24:03+01:00
related_to: [Q-0001]
blocks: [F-0005]
blocked_by: [F-0002]
supersedes: []
superseded_by: []
---

## Problem

Users who keep a markdown-based second brain often have tickets scattered across different directories, which makes it hard to see how they depend on each other — which ones are blockers, which are completed, which are pending.

## Proposed behaviour

The user runs `pm graph`. The command finds the tickets in the root directory (set by `PM_ROOT_DIR`, or the current directory) and reads their dependencies and statuses, as defined in [F-0002](F-0002-check-ticket-graph-integrity.md), then prints their dependency graph to the terminal and exits. This helps the user find blockers and pending tickets.

The tool assumes the tickets and the links between them are healthy, as defined in [F-0002](F-0002-check-ticket-graph-integrity.md). Checking and fixing the graph's integrity is out of scope here.

### Printed graph

The output never uses colours. Rows are printed as they are, whatever the terminal's width; wrapping or cutting long lines is left to the terminal emulator.

Only not-completed tickets are shown: tickets with status `done` or `cancelled` are hidden. All projects are shown together in one pool, with rows ordered only by the blocking relationships, not grouped by project.

Each ticket takes exactly one row, showing its ID, title and status. A ticket without a title shows `(untitled)` in its place. To the left of each row, a graph of lines shows the blocking relationships:

- Every blocking relationship is drawn as a line, running from the blocker's row down to the blocked ticket's row. A line is the only thing that means "blocks": two tickets whose markers sit directly on top of each other are not connected unless a line joins them.
- A line that joins another line connects to it (`┬ ┼ ╮ ┤ ├ ╭`). A vertical line that cuts through a horizontal one (`│`) just crosses it.
- Every ticket appears below all of the tickets that block it.
- Rows start with the _roots_: tickets not blocked by any not-completed ticket. Roots are ordered by their `▸N` (see below), highest first; roots with the same N are ordered alphabetically by ID. Each root is followed by the tickets it blocks, and sibling subtrees are ordered the same way as roots: by `▸N` descending, then alphabetically by ID.
- A ticket that blocks other tickets shows `▸N`, where N is the number of not-completed tickets it blocks, directly or through other tickets.
- A ticket with more than one not-completed blocker shows `⑂N blockers`, where N is its number of not-completed blockers.
- Columns of the graph are reused once their line has ended, so the graph's width grows with the number of lines running side by side, not with the number of tickets.

## Acceptance criteria

- [ ] `pm graph` prints the dependency graph of the tickets in the root directory (as defined in F-0002) and exits.
- [ ] The output contains no colours or other terminal styling.
- [ ] Rows are never wrapped or truncated to fit the terminal's width.
- [ ] Tickets with status `done` or `cancelled` do not appear in the graph.
- [ ] Tickets from all projects appear in one graph, not grouped by project.
- [ ] The graph shows each ticket on exactly one row, with its ID, title and status.
- [ ] A ticket without a title shows `(untitled)` as its title.
- [ ] Every blocking relationship is drawn as a line from the blocker's row to the blocked ticket's row.
- [ ] Two tickets are never shown as connected without a line between them, including when their markers sit in consecutive rows of the same column.
- [ ] Every ticket's row is below the rows of all its blockers.
- [ ] Roots are ordered by `▸N`, highest first; roots with the same N are ordered alphabetically by ID.
- [ ] Sibling subtrees under a ticket are ordered like roots: by `▸N` descending, then alphabetically by ID.
- [ ] A ticket that blocks others shows `▸N`, counting the not-completed tickets it blocks directly or transitively.
- [ ] A ticket with more than one not-completed blocker shows `⑂N blockers`, its number of not-completed blockers.
- [ ] Graph columns are reused once their line has ended.

## Open questions

<!-- what keeps this item at "clarifying" -->

- Should there be an acceptance criterion for line joins (`┬ ┼ ╮ ┤ ├ ╭` connect; a vertical `│` through a horizontal line just crosses it)?

## Notes / history

- 2026-11-20: No performance target for now; a non-functional requirement will be added later if scan speed becomes an issue.
- 2026-11-20: Graph view chosen over these alternatives: an indented tree with repeated shared tickets, Miller columns, layers by depth, box-and-arrow drawing, a dependency matrix, a staircase with one column per ticket, a lane graph where stacked tickets imply a connection, and two lines per ticket. Example of the chosen view:

  ```text
  ●──┬──╮         API-12 Migrate auth schema    ready   ▸7
  ╭──●──│──┬──╮   API-15 Token refresh endpoint blocked ▸4
  ├──┬──●  │  │   OPS-4  Rotate secrets         blocked ▸2
  ●  │     │  │   DOC-2  Auth docs              blocked   ⑂2 blockers
     ●     │  │   OPS-6  Secrets audit          blocked
           ●  │   WEB-9  Session timeout UX     blocked
  ●──┬──┬─────┤   WEB-3  Design system tokens   ready   ▸5
  ╭──│──│─────●   WEB-8  Login page rework      blocked ▸1  ⑂2 blockers
  ●  │  │         WEB-20 Login analytics        blocked
  ╭──●  │         WEB-11 Settings page          blocked ▸1
  ●     │         WEB-21 Settings e2e tests     blocked
        ●         WEB-14 Dark mode              blocked
  ●──╮            API-30 Rate limiting          ready   ▸1
     ●            API-31 Rate-limit dashboard   blocked
  ●               OPS-1  CI cache               ready
  ```

- 2026-11-21: Split: the interactive TUI and cursor navigation moved to F-0005, and finding and reading tickets moved to F-0002. F-0001 now only prints the graph.
