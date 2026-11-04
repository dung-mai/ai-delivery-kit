---
name: build
description: Implements one slice from product/plan/slices.md with tests first, keeping checks green. Use when the conductor or a builder runs a slice; for Codex use build-codex instead.
---

# Build one slice

1. Read the slice, the specs and examples it covers, `product/architecture/overview.md`, `product/ux/design-system.md`.
2. QA tests first: if the slice lists QA-owned tests and they do not exist, ask the qa subagent to write them from `examples.json`, then `node .flow/sensors/flow.mjs freeze add <paths>`.
3. For each task: test first (name contains the ids), smallest change that passes, run the task's check, then the project checks from `.flow/config.json`.
4. Skip `Mode: human` tasks: list them in the slice with the exact command or decision needed.
5. Commit per task: `feat(<slice>): <task>`; stage only the task's files.
6. When the slice is done: screenshots of its screens into `work/evidence/<slice>/`, tick the slice, `flow.mjs board`.
Never edit frozen files, specs or decisions to make code pass: if the spec is wrong, stop and raise a decision card.
