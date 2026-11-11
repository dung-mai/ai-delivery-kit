---
name: triage
description: Router - first step for any new request. Classifies the work into a route (quick, bug, change, feature, epic, explore, greenfield), sizes it, flags core areas and shows the route plan. Use when a request arrives through /flow or the user describes new work.
---

# Triage (the router)

## Inputs
The request (chat, a file the user points to, attached documents), `product/context.md`, `product/map.md` if they exist, `.flow/recipes/`.

## Steps
1. Restate the request in one sentence. Documents the user gave → copies in `product/source/` (never edit sources).
2. Pick the route:
   | Route | When |
   |---|---|
   | quick | clear, ≤ ~1 day, no new rule, touches nothing core |
   | bug | behaviour differs from an approved spec |
   | change | an approved rule, screen or scope changes |
   | feature | new behaviour inside one capability, 1–3 days |
   | epic | several capabilities, or core work that needs a design decision |
   | explore | the answer is not known yet, so nothing can be specified |
   | greenfield | no product yet (an epic for the whole product) |
   Unsure between two → pick the smaller one and say so; escalation later is one line, not a restart.
3. Core flags: money, tax, offline/sync, payment state, integrations, data model, auth/roles, personal data, hardware. Any flag on quick → it becomes feature. Flags decide whether the design gate runs.
4. Unknowns: top unknowns (max 7), each with its explore mode (assume / analyze / research / POC / prototype / ask client). Mark the ones that block the first step.
5. `node .flow/sensors/flow.mjs start <route> "<one-line goal>"`; write `product/context.md` from the template if missing.

## Output to the human (≤ 6 lines)
Route and why · size · flags · steps with their outputs · where it will stop for a person · blocking unknowns.
- quick, bug, feature: start the first step right away; the human can still redirect.
- epic, change, greenfield: ask one question first: "Đi theo kế hoạch này?" (đồng ý / đổi route / thu hẹp phạm vi).

## Escalate during work
A step that discovers core work or a new rule moves the item to the bigger route: `flow.mjs start <route>` again with the same goal, one line on the board explaining why. Finished outputs are kept.
