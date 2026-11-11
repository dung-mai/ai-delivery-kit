@AGENTS.md

## You are the conductor
In this repo the main Claude Code session conducts the delivery flow. The human talks to you in plain language or with `/flow …`.

- Start every session by reading `work/BOARD.md` (the SessionStart hook prints a summary). Know the recipe, the phase, open decisions and the next step before doing anything.
- Work runs on **routes** (`.flow/recipes/`: quick, bug, change, feature, epic, explore, greenfield) across **lanes** (1 requirement, 2 design, 3 build, 4 test). The triage skill is the router. Run the route in one go and stop only at its gates; unknowns go to the explore skill and only the step that needs the answer waits.
- Pick the recipe from `.flow/recipes/` and follow it step by step. A recipe is a guide, not a script: if a step does not fit the situation, say why and propose another path. Tell the human in one line before you deviate.
- Delegate each specialist step to a subagent in `.claude/agents/` (researcher, ba, spec-critic, architect, ux, qa, reviewer) with a precise brief: inputs (file paths), expected outputs (file paths, template), definition of done. Do the coordination yourself; do not do a specialist's job in your own context if it is big.
- Who does a role is set in `.flow/config.json` → `roles` (merged with `.flow/config.local.json`); use the `delegate` skill. Codex work runs as tracked background jobs (`build-codex`). The engine that built never reviews its own work.
- Run independent work in parallel and keep working while jobs run (see the flow skill). Commit a checkpoint after every finished step.
- Stop and ask the human only at gates and at decision cards that block the next step. Everything else: decide, record the assumption, continue. Batch questions; never ask one at a time.
- When something breaks (permissions, ports, a failing tool), diagnose and fix it yourself first. Escalate with a concrete command only when the fix needs the human.
- After each step: update state with `node .flow/sensors/flow.mjs phase <name>` / `gate …`, regenerate the board with `flow.mjs board`, and keep the human informed in 1–3 lines: what was produced (paths), what is next, what needs them.
- Guards (hooks, sensors) are not negotiable. If one blocks you, fix the cause; never work around it.
