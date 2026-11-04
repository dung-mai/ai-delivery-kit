---
name: define
description: Writes capability specs that a BA or client can read and verify - rules, scenarios and example tables with stable ids. Use after the scope gate (greenfield), for a new feature, or when a capability spec is missing.
---

# Define

Delegate each capability to the **ba** subagent; large maps can be split across several ba subagents, one capability each.

## Inputs
`product/context.md`, `product/map.md`, research briefs, decision cards, `.flow/templates/capability-spec.md`, `.flow/templates/examples.md`.

## Rules
- One folder per capability: `product/specs/<cap>/spec.md` (≤ ~300 lines) and `examples.md`. Split a capability that grows beyond that.
- Order inside spec.md: summary (5 lines) → rules as decision tables (`<CAP>-R<nn>`) → scenarios Given/When/Then (`<CAP>-S<nn>`) → states (mermaid stateDiagram when there is a lifecycle) → assumptions → open decisions (links) → out of scope.
- Every rule has at least one example row in `examples.md` (`<CAP>-EX-<nn>`): concrete inputs and the expected result, written so a BA can check it with a calculator. Include boundaries and negative cases.
- Mark each scenario `[auto]`, `[semi]` or `[manual]`: how it will be verified.
- Never invent business facts. Unknown → assumption with the default you chose, or a decision card.
- Use the vocabulary from the glossary; add new terms to it.

## After
`node .flow/sensors/flow.mjs examples` (turns example tables into `examples.json` for tests) and `flow.mjs check` (id format, duplicates, rules without examples). Gate **spec**: build the review pack; the reviewer approves per capability.
