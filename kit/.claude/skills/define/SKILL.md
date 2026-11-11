---
name: define
description: Lane 1, second half. Writes capability specs a BA or client can verify - rules as decision tables, Given/When/Then scenarios with verification labels, example tables (normal, boundary, negative, combination), screens and fields, roles - then gets an independent critic pass and a clean spec-lint before the spec gate. Use after discover, for a feature, or when a capability spec is missing.
---

# Define

## Who
One **ba** subagent per capability, in parallel (they only share the map, glossary and knowledge). Then one **spec-critic** subagent per capability (read-only, never the agent that wrote it). You (the conductor) merge, run the sensors, and prepare the gate.

## Inputs
`product/context.md`, `product/map.md`, `knowledge/` (knowledge skill), research briefs, decision cards, templates `capability-spec.md` and `examples.md`.

## Writing rules (brief these to the ba subagent)
1. One folder per capability: `product/specs/<cap>/spec.md` (≤ ~300 lines, ≤ ~25 rules) and `examples.md`. Bigger → propose a split.
2. Order in `spec.md` follows the template: summary → roles → rules (decision tables, `<CAP>-R<nn>`) → scenarios (`<CAP>-S<nn>`, Given/When/Then, each tagged `[auto]`, `[semi]` or `[manual]`) → states → screens and fields → touchpoints → variations → assumptions → open questions → out of scope.
3. Every rule has examples in `examples.md` (`<CAP>-EX-<nn>`): at least one `thường`, plus `biên` for every number or date limit, `âm` for every "không được", and `tổ hợp` where two rules meet. Numbers a person can check with a calculator; show the arithmetic in `Vì sao`.
4. Money: integer smallest unit or exact decimal; say where rounding happens and which way. Dates: say inclusive/exclusive and the time zone.
5. No vague words (nhanh, phù hợp, linh hoạt, v.v., hợp lý, tối ưu, dễ dùng, …, etc, appropriate, fast): replace with a number, a list or a rule.
6. Never invent business facts. Not in the sources or `knowledge/` → an assumption with the default chosen (`Giả định`, linked to a card) or an open question (`Câu hỏi mở`, linked to a card with mode `ask client`).
7. Use the glossary; add new terms.

## Critic pass (independent)
Brief the **spec-critic**: read `spec.md`, `examples.md`, the map, `knowledge/` and the neighbouring specs; return findings only. Fold every blocker/major back into the spec (or into a card), then run the critic once more if blockers were found. Never more than 2 rounds: what remains goes to the gate as an open question.

## Sensors
`node .flow/sensors/flow.mjs examples` → `examples.json`; `flow.mjs spec-lint` (must show 0 errors; warnings are listed in the review pack); `flow.mjs questions` → `product/questions.md`.

## Gate **spec** (internal: PO + SA)
Build the review pack (examples first, open questions and lint summary on top) and use the spec checklist in `.flow/templates/gates.md`. After approval, `flow.mjs review-pack --mark-approved`. For an epic, gate **scope** follows: send `product/questions.md` to the client and confirm the rules through the examples and the prototype.
