---
name: delegate
description: Sends a role's task (research, ux, qa, docs, or a draft spec) to the engine configured for that role in .flow/config.json roles - Claude subagent, Codex or DeepSeek - to spread usage across subscriptions. Use whenever you are about to brief a specialist.
---

# Delegate a role to its engine

Read `.flow/config.json` (merged with `.flow/config.local.json`): `roles.<role>` is `claude`, `codex` or `deepseek`.

| Engine | How | Good for |
|---|---|---|
| claude | the matching subagent in `.claude/agents/` (Agent tool; run in background when you have other work) | judgement: specs, decisions, architecture, review, research that needs care |
| codex | the build-codex skill steps: brief file + `flow.mjs run <name> -- codex …` in the background | code, tests from examples, HTML/UI work, screenshots, walkthroughs, review-pack text, mechanical edits across many files |
| deepseek | brief file + `flow.mjs run <name> -- <deepseek.command> "Read work/briefs/<name>.md and follow it exactly."` | research summaries, drafts, docs on a machine where the API works |

Rules
- The brief file is the whole context: inputs (paths), output (paths + template), definition of done, language. Other engines cannot see this conversation or the subagent definitions.
- Independence: the engine that built something never reviews it. If `build` is codex, review is claude; if a spec was drafted by codex or deepseek, you (claude) check it against the template and the sources before the gate.
- If an engine is unavailable on this machine (doctor, quota, network), fall back to claude for that task and say so in one line; do not change the config yourself.
- Results always come back as files. Read them before you report the step as done.
