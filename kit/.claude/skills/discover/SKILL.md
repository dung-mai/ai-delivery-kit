---
name: discover
description: Lane 1, first half, for epics and greenfield. Reads every source, builds shared understanding before specs - goals, roles, capability map with depth, variations, integrations, unknowns - and says what the sources do not say. Use right after triage for epic or greenfield work.
---

# Discover

Delegate to the **ba** subagent; researchers available for facts. Check `knowledge/` first.

## Inputs
`product/source/*` (masked: no real client personal data), `product/context.md`, `knowledge/`, triage notes.

## Steps
1. **Source inventory** in `product/context.md` → `## Nguồn`: one line per source (what it covers, how reliable: đã ký / đề xuất / ghi chú họp), then **what the sources do not say** for this scope. That gap list is the most valuable output of discover.
2. Context: goal, success measures, roles and what each may / may not do, constraints (time, tech, law), glossary (TH / EN / VI terms when the client is not Vietnamese).
3. **Variation axes**: what differs by store, branch, channel, terminal type, customer group, time. Each axis becomes a column in later example tables.
4. **Touchpoints**: integrations, devices, documents (receipts, tax invoices) the scope touches, one line each with direction and owner.
5. `product/map.md`: capabilities with a one-line purpose, depth this iteration (`sâu` / `vừa` / `giả lập` / `ngoài phạm vi`), main risk, and for an epic the proposed split into features.
6. Unknowns → draft cards with an explore mode each (explore skill); mark which block define. Run `flow.mjs questions`.
7. Demo script: 3–6 steps a stakeholder will watch at the end.

## Done when
Every source is inventoried with its gaps; every capability has a depth; variation axes and touchpoints are listed; every blocking unknown is a card. For greenfield, gate **scope**: the human approves map + demo script.
