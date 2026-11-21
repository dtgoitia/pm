---
id: F-0002
title: Check ticket graph integrity
type: feature
status: clarifying
created: 2026-11-20T07:44:59+01:00
related_to: [Q-0001]
blocks: [F-0001, F-0006]
blocked_by: []
supersedes: []
superseded_by: []
---

## Problem

The dependency graph built from a user's markdown tickets is only as reliable as the tickets' frontmatter. Inconsistent or incomplete tickets make the graph wrong without the user noticing.

## Proposed behaviour

### Finding and reading tickets

Every `pm` subcommand works on the _root directory_ (aka the user's second-brain directory). The root directory is taken from the `PM_ROOT_DIR` environment variable; if it isn't set, the current directory is used. No subcommand takes the root directory as an argument ([PDR-0001](../decisions/pdrs/PDR-0001-root-directory-comes-from-pm-root-dir.md)).

The tool scans the whole tree under the root directory and identifies the tickets in it. A file is a ticket when all of the following hold:

1. It is a markdown file.
2. It has a frontmatter.
3. Its frontmatter has `type: ticket`.
4. Its frontmatter contains the `created_at`, `id`, `project` and `status` fields.

A ticket's title comes from the optional `title` field of its frontmatter.

Dependencies between tickets come from the `blocks` and `blocked_by` fields of a ticket's frontmatter, which list the IDs of other tickets. Dependencies can cross projects: a ticket can block, or be blocked by, a ticket from any project in the root directory.

A ticket's status comes from the `status` field of its frontmatter. Statuses are a fixed set: `draft`, `ready`, `in-progress`, `blocked`, `done` and `cancelled`. `done` and `cancelled` count as completed; every other status counts as not completed.

### Integrity checks

The user runs `pm check` to check the tickets in the root directory for integrity problems. The command reports each problem on its own line, naming the file or files involved, the ticket ID (when known) and what is wrong. It exits with a non-zero code when it finds any problem, and with `0` otherwise, so it can be used in scripts and git hooks. It never changes any file; fixing problems is covered by [F-0006](F-0006-fix-ticket-graph-integrity-problems.md).

Problems to detect include:

- `blocks` and `blocked_by` that disagree with each other.
- References to ticket IDs that don't exist.
- Dependency cycles.
- Self-references: a ticket that lists its own ID in its `blocks` or `blocked_by`. Self-references are not allowed.
- Partial tickets: files with `type: ticket` that are missing `id`, `created_at`, `project` or `status`.
- Duplicate IDs: two or more tickets with the same `id` anywhere in the root directory, since IDs must be unique across all projects.
- Tickets whose `status` is not one of `draft`, `ready`, `in-progress`, `blocked`, `done` or `cancelled`.
- Markdown files whose frontmatter can't be parsed but contains `type: ticket`.

## Acceptance criteria

- [ ] Only markdown files whose frontmatter has `type: ticket` and contains `created_at`, `id`, `project` and `status` are treated as tickets.
- [ ] Each ticket's title is taken from its frontmatter `title` field, which is optional.
- [ ] The root directory is the value of `PM_ROOT_DIR` when it is set, and the current directory otherwise.
- [ ] Tickets are found in any subdirectory of the root directory.
- [ ] A dependency is recorded for every ID listed in a ticket's `blocks` or `blocked_by`.
- [ ] A dependency between tickets of different projects is recorded the same way as one within a project.
- [ ] Each ticket's status is taken from its frontmatter `status` field.
- [ ] Tickets with status `done` or `cancelled` are reported as completed; tickets with `draft`, `ready`, `in-progress` or `blocked` are reported as not completed.
- [ ] `pm check` checks the tickets in the root directory.
- [ ] Each problem is reported on its own line, naming the file or files involved, the ticket ID when known, and what is wrong.
- [ ] `pm check` exits with a non-zero code when it finds a problem, and with `0` when it finds none.
- [ ] `pm check` never modifies any file.
- [ ] A `blocks` entry without the matching `blocked_by` on the other ticket, or the other way round, is reported.
- [ ] A `blocks` or `blocked_by` entry naming an ID that no ticket has is reported.
- [ ] A dependency cycle is reported.
- [ ] A ticket listing its own ID in its `blocks` or `blocked_by` is reported as a self-reference.
- [ ] A file with `type: ticket` missing any of `id`, `created_at`, `project` or `status` is reported as a partial ticket.
- [ ] Two or more tickets with the same `id` anywhere in the root directory are reported as duplicates.
- [ ] A ticket whose `status` is not one of `draft`, `ready`, `in-progress`, `blocked`, `done` or `cancelled` is reported.
- [ ] A markdown file whose frontmatter can't be parsed but contains `type: ticket` is reported.

## Open questions

<!-- what keeps this item at "clarifying" -->

- Is the list of problems under _Integrity checks_ complete? It reads "Problems to detect include:", which suggests there could be others. If it's complete, the wording becomes "`pm check` detects these problems:" and the criteria cover everything; if not, the missing problems need adding.

## Notes / history

- 2026-11-21: Finding and reading tickets (what counts as a ticket, dependencies, statuses) moved here from F-0001, which it now blocks.
- 2026-11-21: Fixing problems split out into F-0006; this item now only detects them. `status` became a required ticket field; `title` stays optional (F-0001 shows `(untitled)` when missing).
