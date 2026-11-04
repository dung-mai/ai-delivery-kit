---
name: build-codex
description: Hands one slice to Codex CLI (codex exec) in its own git worktree, then reviews and merges the result. Use when .flow/config.json engines.build is codex.
---

# Build a slice with Codex

1. Prepare: `git worktree add ../wt-<slice> -b slice/<slice>`. Make sure QA tests for the slice exist and are frozen (build skill step 2).
2. Write the brief to `work/briefs/<slice>.md`: slice text, ids, files to touch, checks to run, "do not edit frozen files", "commit per task if git allows, otherwise leave changes uncommitted". Keep it self-contained: Codex has no access to this conversation.
3. Run in the worktree (long timeout, background if supported):
   `codex exec --sandbox workspace-write "Read work/briefs/<slice>.md and follow it exactly."`
   A one-line prompt that points at a file avoids quoting problems on Windows.
4. Record tokens: the last lines of codex output contain `tokens used`; log them with `node .flow/sensors/flow.mjs effort machine codex <tokens> "<slice>"`.
5. Review the diff yourself (or with the reviewer subagent, never with Codex): ids covered, no frozen file touched (`flow.mjs freeze check`), checks green. If Codex could not commit (sandbox), commit its changes per task from the main repo.
6. Merge the worktree branch, remove the worktree, tick the slice.
If Codex stops on quota or errors twice, build the slice with the build skill instead and say so.
