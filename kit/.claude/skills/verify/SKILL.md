---
name: verify
description: Independent check of a slice or iteration against specs and examples - deterministic sensors first, then a read-only reviewer on a different engine than the builder, plus a walkthrough and the debt register. Use after each slice and before the demo gate.
---

# Verify

1. Deterministic first: project checks from `.flow/config.json`, `node .flow/sensors/flow.mjs check`, `flow.mjs trace` (every rule and example covered by a test, every scenario marked), `flow.mjs freeze check`.
2. Walkthrough: the builder (or you) writes `work/reviews/<slice>-walkthrough.md` from `.flow/templates/walkthrough.md`. One page; the human reads this instead of the whole diff.
3. Reviewer subagent (read-only, not the builder's engine): compare the diff with the specs, examples, architecture, design system and `docs/conventions.md` + the reference module. Findings with severity (blocker / major / minor) and file:line. Convention drift is at least minor; drift from the reference module in a new module is major. Environment problems are listed separately with the command to fix them.
4. Shortcuts accepted on purpose go to `product/debt.md` (template `debt.md`) with a DEBT id, linked from the walkthrough. Unrecorded shortcuts are findings.
5. For UI slices: `flow.mjs shots` of the changed screens, scored with `.flow/templates/ui-critique.md`; anything below 4/5 is a minor finding.
6. Write `work/reviews/<slice>.md` from the template with the verdict on the last line: `VERDICT: ready | fix | spec-problem | env`.
7. `fix` → back to build with the findings (max 2 rounds; stop if a round changes nothing). `spec-problem` → decision card, the human decides. `env` → tell the human the exact command.
