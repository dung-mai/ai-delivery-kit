---
name: verify
description: Independent check of a slice or iteration against specs and examples - deterministic sensors first, then a read-only reviewer on a different engine than the builder. Use after each slice and before the demo gate.
---

# Verify

1. Deterministic first: project checks from `.flow/config.json`, `node .flow/sensors/flow.mjs check`, `flow.mjs trace` (every rule and example covered by a test, every scenario marked), `flow.mjs freeze check`.
2. Reviewer subagent (read-only, not the builder's engine): compare the diff with the specs, examples, architecture and design system. Findings with severity (blocker / major / minor) and file:line. Environment problems are listed separately with the command to fix them; they are not code findings.
3. Write `work/reviews/<slice>.md` from the template with the verdict on the last line: `VERDICT: ready | fix | spec-problem | env`.
4. `fix` → back to build with the findings (max 2 rounds; stop if a round changes nothing). `spec-problem` → decision card, human decides. `env` → tell the human the exact command.
5. Evidence: screenshots per scenario `[auto]`/`[semi]` into `work/evidence/`.
