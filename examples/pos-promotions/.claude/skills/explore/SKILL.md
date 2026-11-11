---
name: explore
description: Answers an open question that blocks a spec or a design by the cheapest mode that works - assume, analyze, research, POC spike, prototype or ask the client - with a timebox, and always ends with a decision card. Use when the router picks explore, when define or architect hit an unknown, or when the user asks to research, check feasibility, try a POC or prepare questions for the client.
---

# Explore

Explore is not a separate lane. Any lane calls it when it meets an unknown; only the step that needs the answer waits.

## 1. Frame (before any work)
Open or update `product/decisions/D-<nn>-<slug>.md` (decide skill format) with: the question in one sentence, what it blocks (step, capability ids), the mode, the timebox, and what answer would change what.

## 2. Pick the cheapest mode that can answer it
| Mode | Use when | Who | Timebox | Output |
|---|---|---|---|---|
| assume | low impact and easy to undo | lane owner | minutes | assumption line in the spec (`Giả định`), listed in the review pack |
| analyze | the answer is in our own material: sources, contract, old system, data, `knowledge/` | ba / architect subagent | ≤ ½ day | facts with file references |
| research | how others do it, standards, law | researcher subagents in parallel (research skill) | ≤ ½ day | `product/research/R-<nn>-*.md` with sources |
| POC | can it work, how fast, what limits | Codex job in `spikes/<slug>/` | ≤ 2 days | yes / no / yes-if, measured numbers; spike code is never merged |
| prototype | people will only know when they see it | ux subagent | ≤ 1 day | 2–3 clickable options in `product/ux/` |
| ask client | business, scope, money or legal choice only the client can make | PO via the question list | batched weekly | entry in `product/questions.md` with our recommendation and the default we use meanwhile |

Rules:
- Check `knowledge/` first (knowledge skill); half the "research" questions are already answered there.
- Never send the client an open question. Always: options, our recommendation, an example, and a prototype when it is about a screen.
- While a client question is open, continue on the stated default; mark the affected rules `Giả định`.
- Timebox runs out → write what is still unknown and propose the next cheapest mode. No open-ended reports.

## 3. Finish
Card complete: options with consequences, recommendation, confidence, who decides. Status stays `mở` until the owner decides (`/flow decide`). Then update the spec/design it blocks in the same change; if the answer changes approved behaviour, open a change request.

## 4. Learn
An answer that another capability or project will need again → propose it for `knowledge/` (knowledge skill), owner confirms.
