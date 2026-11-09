---
name: build-codex
description: Hands one slice (or a QA-test, UI or docs task) to Codex CLI as a tracked background job, then checks, commits and reviews the result. Use whenever .flow/config.json roles.build (or roles.qa / roles.ux / roles.docs) is codex.
---

# Work through Codex

Codex runs in a sandbox: by default it cannot reach the network, cannot write `.git`, and cannot write outside its folder. Almost every "Codex failed" comes from asking it to do one of those. So **you** do the environment work, **Codex** only edits code and runs local checks.

## 1. Prepare (you, outside the sandbox)
- Dependencies installed, DB/containers up, migrations applied, the slice's QA tests present and frozen.
- `node .flow/sensors/flow.mjs doctor` once per machine: it checks that the Codex sandbox allows network (needed for tests that talk to the DB on localhost) and, on Windows, that the elevated/MXC sandbox is configured.
- Mode from `.flow/config.json` → `codex.mode`:
  - `inplace` (default): Codex edits the main working tree. Meanwhile you do only non-code work (specs, review of the previous slice, walkthroughs). Do not edit the same files.
  - `worktree`: only when two code slices really run in parallel. Create `.worktrees/<slice>` (git-ignored), then install dependencies there yourself before handing it over.

## 2. Brief
Write the `## Brief` section of `work/slices/<slice>.md` (one file per slice holds brief, Codex result, walkthrough and review): goal, ids covered, files to touch, the reference module to copy, checks to run, "do not edit frozen files", "do not run git commands, do not install packages, do not start or stop services; if something is missing, write it under BLOCKED in the `## Kết quả` section of work/slices/<slice>.md and stop". End with: "When done, fill the `## Kết quả` section of work/slices/<slice>.md: what you changed, checks run and their result, anything BLOCKED". Self-contained: Codex cannot see this conversation.

## 3. Run as a tracked job (background)
Run with the Bash tool in the background (run_in_background):
`node .flow/sensors/flow.mjs run <slice> -- codex <codex.args from config> "Read the Brief section of work/slices/<slice>.md and follow it exactly."`
A one-line prompt that points at a file avoids quoting problems on Windows. The job appears in the status line, `/tasks` and `flow.mjs watch`; tokens are recorded automatically.

## 4. When it ends
- Read the `## Kết quả` section of `work/slices/<slice>.md` and `flow.mjs logs <slice>`.
- Classify a failure before reacting:
  | Symptom in log/result | Cause | Do |
  |---|---|---|
  | network / ECONNREFUSED / fetch failed / registry | sandbox network | fix config (doctor), or do that step yourself, then rerun |
  | permission denied on .git / index.lock | sandbox protects .git | expected: you commit |
  | BLOCKED: missing package / service | environment | do it yourself, rerun with "continue: tasks already ticked are done" |
  | tests fail on its own code | real bug | rerun once with the exact failing output appended to the brief |
  | usage limit / quota | Codex quota | build the rest with the build skill (Claude) and say so |
- At most `codex.max_rounds` (default 2) reruns of the same slice; then take over or ask the human. Never silently redo the whole slice yourself on the first failure.

## 5. Accept
`flow.mjs freeze check`, project checks, then commit per task (`feat(<slice>): …`). Review with the reviewer subagent (Claude), never with Codex. Remove the worktree if one was used.
