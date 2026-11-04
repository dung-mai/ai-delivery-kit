---
name: plan
description: Splits approved specs and architecture into vertical slices and small tasks, walking skeleton first. Use after the architecture gate, or after an approved change request.
---

# Plan

## Output: `product/plan/slices.md` (template `slice-plan.md`)
- Slice 0 = walking skeleton: repo, CI, one screen calling one endpoint writing one row, deployed or runnable with one command.
- Each slice is vertical (UI → API → data → tests), demoable, ≤ 1 day of agent work, and lists: capabilities and ids it covers, tasks (each ≤ 30 min, test first, files, check command), `Mode: ai | human`, the demo step it unlocks, and its builder engine.
- Mark QA-owned tests: the qa subagent writes them from `examples.json` before build; they get frozen.
- Order by risk: the riskiest deep capability right after the skeleton.
No separate gate: the plan is shown with the architecture review, or approved in one line.
