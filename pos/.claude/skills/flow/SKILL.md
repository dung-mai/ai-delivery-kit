---
name: flow
description: Entry point of the AI delivery flow. Use when the user types /flow (start, status, next, change, decide, effort, pack, resume) or asks to start, continue or check a piece of work in this repo.
---

# /flow — conduct the delivery flow

Arguments: `$ARGUMENTS` (may be empty). Read `work/BOARD.md` and `.flow/state/flow.json` first.

## Sub-commands
| Input | Do |
|---|---|
| `"<request>"` or `start "<request>"` | Run the **triage** skill: classify, pick a recipe, show the plan in ≤ 6 lines, ask the human to confirm (one question, options). Then run the first step. |
| `status` (or empty) | `node .flow/sensors/flow.mjs board`, then summarise: recipe, phase, running jobs/subagents, what needs the human, effort and Claude 5h usage. ≤ 8 lines. |
| `next` | Do the next step(s) of the current recipe until an output exists or a gate/decision needs the human. |
| `change "<what changed>"` | **change** skill. |
| `decide` | Open decision cards with options and recommendation; record answers with the **decide** skill. |
| `effort [minutes "note"]` | `flow.mjs effort report`, or `flow.mjs effort log <minutes> "<note>"`. |
| `pack` | **review-pack** skill. |
| `resume` | `flow.mjs resume-report`, then handle each item (see Resume). |

## Who does what (spread usage)
Before briefing any specialist, use the **delegate** skill: `roles` in `.flow/config.json` says whether research, ba, architect, ux, qa, build, review, docs go to a Claude subagent, Codex or DeepSeek. Default: Claude for judgement (specs, decisions, architecture, review), Codex for volume (code, tests, UI, docs). The human watches the split in `flow.mjs timeline` and the effort ledger.

## Run things in parallel
Waiting is the biggest cost. Start independent work together and do your own work while it runs:
- research questions: several researcher subagents in one message, in the background;
- define: one ba subagent per capability, in parallel;
- ux-options ‖ architect (both only need the approved specs);
- build of slice N (Codex job in the background) ‖ you review slice N-1, write its walkthrough, or prepare the brief for slice N+1;
- qa tests for the next slice ‖ build of the current one.
Only sequence what really depends on an output. Never let two writers touch the same files.

## Step loop
1. Find the current step in `.flow/recipes/<recipe>.md`; check its inputs exist.
2. Delegate (see above) with: goal, input paths, output paths + template, definition of done, language.
3. When it returns: read the output and check it against the definition of done. `flow.mjs check`.
4. Checkpoint: `flow.mjs phase <step>`, commit the outputs (`chore(flow): <step> done`), so an interruption never loses a finished step. For a gate: review pack, ask, then `flow.mjs gate <name> approved "<who>"`.
5. Tell the human in 1–3 lines: produced (paths), running in background, next, what needs them.

## Usage awareness
`.flow/state/usage.json` (written by the status line) has the Claude 5-hour usage. Above 60%: move remaining volume work to Codex. Above 85%: finish the current step, checkpoint, and tell the human what Codex can continue alone.

## Resume
After an interruption (closed terminal, quota, crash) the SessionStart hook lists what was cut off. For each item: a job → read its log and result file, rerun with "continue: tasks already ticked are done"; a subagent → check whether its output file is complete, rerun only the missing part; uncommitted changes → check against the step, commit a checkpoint or ask the human if unclear; leftover worktrees → merge or remove. Then continue the recipe.

## Gates
Regenerate the review pack so the reviewer reads one HTML/PDF. Ask with options: approve / change (with a note) / stop here.

## Never
- Start the next gated step without the approval recorded.
- Ask the human things you can find in the repo, research or decisions.
- Skip a guard. If a check fails, fix it or report it with the exact command.
