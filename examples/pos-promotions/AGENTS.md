# AGENTS.md

Rules for every agent working in this repo (Claude Code, Codex, OpenCode, …). Project facts go in `product/context.md`; this file is the delivery framework (AI Delivery Kit v3).

## Where things live
- `product/` — the truth about the product, written for humans (BA, client) first:
  `context.md` (goal, users, constraints, glossary), `map.md` (capability map), `specs/<capability>/spec.md` + `examples.md`,
  `decisions/D-xx-*.md` (decision cards), `questions.md` (client question list, generated), `changes/CR-xx-*/` (change requests as deltas), `research/`, `ux/`, `architecture/`, `plan/slices.md`.
- `knowledge/` — reusable domain knowledge with sources (domain, law, hard cases, integrations, glossary). Read it before drafting; add to it only through the knowledge skill.
- `work/` — run state: `BOARD.md` (generated), `effort-ledger.md`, `slices/<slice>.md` (one file per slice: brief, result, walkthrough, review), `evidence/<slice>/` (final screenshots only). Local only, git-ignored: `jobs/`, `tasks/`, `review-pack/`. Do not create other files in `work/`.
- `.flow/` — framework: recipes, templates, hooks, sensors, `config.json`. `.claude/` — skills and subagents.

## Hard rules
1. Write artifacts in the language set in `.flow/config.json` (`language`). Code, identifiers and commit messages in English.
2. Every requirement has a stable id: rule `<CAP>-R<nn>`, scenario `<CAP>-S<nn>`, example `<CAP>-EX-<nn>` (CAP = 2–5 capital letters, e.g. PRC). Never renumber; retire an id instead of reusing it.
3. Automated tests mention the ids they cover in their name, or load the capability's `examples.json`.
4. Do not edit frozen files (`.flow/state/frozen.json`). If a frozen test is wrong, say so; a human releases it with `node .flow/sensors/flow.mjs freeze release <path>`.
5. Ambiguity is never silently resolved: record it as an assumption in the spec or as a decision card (`product/decisions/`). No vague words in specs (fast, appropriate, etc.): a number, a list or a rule.
6. After a change request is approved, its deltas are merged into `product/specs/` and the change is archived; specs always describe the current truth.
7. Never commit secrets, never log credentials, never edit `.env`.
8. Before you stop: run `node .flow/sensors/flow.mjs check` and fix what it reports.
9. A spec goes to its gate only with `flow.mjs spec-lint` at 0 errors and an independent spec-critic pass.

## Code
Follow `docs/conventions.md` and copy the structure of the reference module it names. Record deliberate shortcuts in `product/debt.md`.

## Checks
`node .flow/sensors/flow.mjs check` (framework checks) plus the project commands listed in `.flow/config.json` → `checks`.
