---
name: decide
description: Turns an ambiguity into a decision card with options and a recommendation, and records the human's choice. Use whenever something is unclear, contested or hard to reverse, and when the user runs /flow decide.
---

# Decide

## Classify every unknown first
| Class | When | What happens |
|---|---|---|
| assume | small impact, easy to change later | write the assumption in the spec, continue, list it in the review pack |
| research | the industry has a known answer | research skill, then a card with the recommendation |
| ask client | depends on the client, law, contract or a partner | card in the client question list; continue on a stated temporary assumption |
| spike | not sure it is technically possible or fast enough | time-boxed experiment (spike recipe), card updated with the result |
| defer | not needed for the current goal | backlog line in `product/map.md`, out of scope |

Stop the flow only for a card that is high impact AND hard to reverse AND blocks the next step.

## Card format
`product/decisions/D-<nn>-<slug>.md` from `.flow/templates/decision-card.md`: question, context (2–4 lines), options A/B/C with consequences, recommendation and why, class, blocks (which step), status (`mở` / `đã chốt` / `thay thế bởi D-xx`), decided by and date.

## Recording a decision
When the human answers: set status, `Quyết định:` line, who and when; update the specs/plan it affects in the same change; if it changes approved behaviour, open a change request instead of editing silently.

## Client question list
`node .flow/sensors/flow.mjs board` lists open `ask client` cards. When asked for "câu hỏi cho khách", produce one message with all of them, each answerable in one line, with the default we will use if no answer comes.
