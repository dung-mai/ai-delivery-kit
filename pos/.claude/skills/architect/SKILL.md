---
name: architect
description: Designs the solution for approved specs - architecture, data model, contracts, risky choices as ADRs, with alternatives considered. Use after the spec gate for greenfield and for features that touch data model, money, auth, integrations or offline.
---

# Architect

Delegate to the **architect** subagent (strongest model).

## Inputs
Approved specs and examples, decisions, research, `product/context.md` constraints, existing code if any.

## Output: `product/architecture/`
- `overview.md` from the template: context diagram (mermaid), modules and their responsibilities mapped to capabilities, data model (mermaid erDiagram or table), contracts (API/events) per module, cross-cutting rules (money, ids, errors, auth, offline), what is real and what is simulated in this iteration.
- `adr/ADR-<nn>-<slug>.md` for each hard-to-reverse choice, with 2 alternatives rejected and why.
- A stack proposal with reasons tied to constraints (time box, team skills, deployment). Offer the human the choice when two stacks are both reasonable.

## Rules
- Prefer the simplest structure that keeps module boundaries clean (modular monolith first; split later along the same boundaries).
- Business rules that must run in several places (server, offline client) live in a pure module with no framework imports.
- For every external system: interface, simulator with failure switches, idempotency, timeout, retry, reconciliation.
Gate **architecture**: the human approves overview + ADRs (the review pack shows them).
