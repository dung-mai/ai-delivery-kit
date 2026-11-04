---
name: flow
description: Entry point of the AI delivery flow. Use when the user types /flow (start, status, next, change, decide, effort, pack) or asks to start, continue or check a piece of work in this repo.
---

# /flow — conduct the delivery flow

Arguments: `$ARGUMENTS` (may be empty). Read `work/BOARD.md` and `.flow/state/flow.json` first.

## Sub-commands
| Input | Do |
|---|---|
| `"<request>"` or `start "<request>"` | Run the **triage** skill: classify the work, pick a recipe, show the plan in ≤ 6 lines, ask the human to confirm (one question, options). Then run the first step. |
| `status` (or empty) | `node .flow/sensors/flow.mjs board` then summarise: recipe, phase, last output, open decisions, what needs the human, effort so far. ≤ 8 lines. |
| `next` | Do the next step of the current recipe until its output exists or a gate/decision needs the human. |
| `change "<what changed>"` | Run the **change** skill (delta, impact, approval, then only the difference). |
| `decide` | List open decision cards (`product/decisions/`, status `mở`) with options and recommendation; record the human's answers with the **decide** skill. |
| `effort [minutes "note"]` | No args: `flow.mjs effort report`. With args: `flow.mjs effort log <minutes> "<note>"`. |
| `pack` | Run the **review-pack** skill and tell the human where the HTML/PDF is. |

## Step loop (for start and next)
1. Find the current step in `.flow/recipes/<recipe>.md`. Check its inputs exist; if not, say which step is missing.
2. Brief the specialist subagent (or the skill) with: goal, input paths, output paths + template, definition of done, language.
3. When it returns: check the output against the definition of done yourself (read it). Run `node .flow/sensors/flow.mjs check`.
4. Record: `flow.mjs phase <step>`; for a gate, show the review page and ask; on approval `flow.mjs gate <name> approved "<who>"`.
5. Tell the human: what was produced (paths), what is next, what needs them. Then continue unless a gate or a blocking decision is open.

## Gates
At a gate, regenerate the review pack (`review-pack` skill) so the reviewer reads one HTML/PDF instead of raw files. Ask with options: approve / change (with a note) / stop here. A "change" answer goes back to the step with the note; do not argue the note, apply it or explain in one line why not.

## Never
- Start the next gated step without the approval recorded.
- Ask the human things you can find in the repo, the research or the decisions.
- Skip a guard. If a check fails, fix it or report it with the command the human must run.
