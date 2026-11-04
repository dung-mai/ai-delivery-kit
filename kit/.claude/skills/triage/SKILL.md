---
name: triage
description: First step for any new request. Classifies the work (greenfield, feature, change, bug, spike, research), picks the recipe, sizes it and lists what is unclear. Use when a request arrives through /flow or the user describes new work.
---

# Triage

## Inputs
The request (chat, a file the user points to, or attached documents), `product/context.md` if it exists, `.flow/recipes/`.

## Steps
1. Restate the request in one sentence. If the user gave documents, list them and save copies under `product/source/` (never edit sources).
2. Classify: `greenfield` (no product yet), `feature` (new capability in an existing product), `change` (modifies approved behaviour), `bug`, `spike` (a question to answer by experiment), `research` (a question to answer by reading). When two fit, pick the one with more gates and say why.
3. Size: S (< 1 day), M (≤ 1 week), L (> 1 week). For L, propose a first slice that fits in a week.
4. Risk flags: money, auth/roles, personal data, data model, public contract, external integration, offline/sync, hardware. Each flag adds the gates its recipe says.
5. Unknowns: list the top unknowns (max 7) with a first guess of their class: assume / research / ask client / spike / defer (see the decide skill).
6. Write `product/context.md` from `.flow/templates/context.md` if missing, and `node .flow/sensors/flow.mjs start <recipe> "<one-line goal>"`.

## Output to the human (≤ 6 lines, then one question)
Recipe and why · size · flags · first 3 steps with their outputs · top unknowns. Question: "Đi theo kế hoạch này?" with options: đồng ý / đổi công thức / thu hẹp phạm vi.
