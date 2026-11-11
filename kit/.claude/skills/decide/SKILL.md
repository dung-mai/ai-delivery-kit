---
name: decide
description: Records decisions - writes decision cards with options and a recommendation, shows open cards to the owner, and records the choice in the specs it affects. Use when the user runs /flow decide, when a card needs an answer, or when explore has finished a card.
---

# Decide

How to *find* the answer (assume / analyze / research / POC / prototype / ask client) is the **explore** skill. This skill is about the card and the choice.

## Card format
`product/decisions/D-<nn>-<slug>.md` from `.flow/templates/decision-card.md`: question, context (2–4 lines), options A/B/C with consequences, recommendation and why, mode (`Loại`), what it blocks (`Chặn`), affected ids, status (`mở` / `đã chốt` / `thay thế bởi D-xx`), decided by and date.

Stop the flow only for a card that is high impact AND hard to reverse AND blocks the next step. Everything else continues on the stated default.

## /flow decide
Show open cards, blocking ones first, each in ≤ 5 lines with options and the recommendation; ask with options. Batch: never one question at a time.

## Recording a decision
Set status, `Quyết định:` line, who and when; update the specs/plan it affects in the same change (assumption lines become rules); if it changes approved behaviour, open a change request instead of editing silently. Run `flow.mjs questions` so the client list stays current.
