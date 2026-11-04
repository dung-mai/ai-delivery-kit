---
name: discover
description: Greenfield and large features. Builds the shared understanding before specs: goals, users, scope candidates, constraints, unknowns, and what a successful demo looks like. Use right after triage for greenfield or L-sized work.
---

# Discover

Delegate to the **ba** subagent with the researcher available for facts.

## Inputs
`product/source/*`, `product/context.md`, triage notes.

## Steps
1. Fill `product/context.md`: goal, success measures, users and roles, constraints (time, tech, legal), glossary of domain words (one line each).
2. Draft `product/map.md` from the template: capabilities as rows, each with a one-line purpose, a depth for this iteration (`sâu` / `vừa` / `giả lập` / `ngoài phạm vi`) and the main risk.
3. Write the demo script: 3–6 steps a stakeholder will watch at the end. This is the acceptance test of the whole iteration.
4. Collect unknowns into `product/decisions/` as draft cards (status `mở`) using the decide skill's classes. Mark which ones block define.
5. Identify research questions (how do other systems do X, what is the standard for Y) and hand them to the research skill.

## Done when
Map, context and demo script exist; every capability has a depth; every blocking unknown is a card. Gate **scope**: the human approves the map + demo script.
