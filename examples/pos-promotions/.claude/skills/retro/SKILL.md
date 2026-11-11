---
name: retro
description: Turns what went wrong or slow into concrete changes to the kit (skills, templates, hooks, sensors, rules), proposed for approval. Use at the end of an iteration, after a painful step, or when the user asks what to improve.
---

# Retro

1. Read `work/effort-ledger.md`, `work/slices/` (review sections), the board history and git log of the iteration.
2. List: where human time went, where agents looped or failed, which guard caught something, which ambiguity surfaced late.
3. For each pain: root cause in one line and a change to the kit (which file, what to change). Prefer a deterministic guard over a new instruction.
4. Write `work/retro-<date>.md`. Apply only the changes the human approves; changes to the kit itself go back to the kit repo.
