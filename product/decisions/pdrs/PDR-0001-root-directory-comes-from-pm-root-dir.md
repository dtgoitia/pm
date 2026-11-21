---
id: PDR-0001
title: Root directory comes from PM_ROOT_DIR
question: Q-0001
created: 2026-11-21T18:12:39+01:00
---

## Decision

Every `pm` subcommand takes the root directory (the user's second-brain directory) from the `PM_ROOT_DIR` environment variable. If `PM_ROOT_DIR` is not set, the current directory is used.

No subcommand takes the root directory as a command-line argument.

## Consequences

- `pm graph` ([F-0001](../../items/F-0001-print-dependency-graph-of-markdown-tickets.md)) and `pm check` ([F-0002](../../items/F-0002-check-ticket-graph-integrity.md)) take no root-directory argument.
- Future subcommands follow the same rule.
