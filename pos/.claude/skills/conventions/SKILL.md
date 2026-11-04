---
name: conventions
description: Sets up or extracts the code conventions of a project and turns them into machine checks plus one reviewed example module. Use before the first business code of a greenfield project (slice 0), when adopting the kit in an existing codebase, or when agents keep drifting from the house style.
---

# Conventions

AI follows examples and failing checks, not long prose. The output of this skill is therefore mostly **config and one example**, and a short text.

## Greenfield (no code yet), part of slice 0
1. Propose, in one table for the human: language/framework versions, folder layout per module, naming (files, types, functions, DB), error handling shape, logging, money/date/id rules, test layout and naming (ids in test names), formatter and linter. Offer 2 options only where it really matters.
2. Encode everything that a tool can check:
   - formatter + linter config (e.g. Biome, or ESLint + Prettier), TypeScript `strict`;
   - module boundaries (e.g. eslint-plugin-boundaries or dependency-cruiser: domain imports no framework, modules talk through their public index only);
   - size limits (max lines per file and function, complexity), duplication (jscpd), unused code/deps (knip) when the stack supports them.
   - Put the commands in `.flow/config.json`: `checks` (whole project, run at Stop) and `post_edit.format` / `post_edit.lint` (only the edited file, must run in a few seconds).
3. Build the **reference module**: one small module that goes through every layer the project uses (API → service → domain → data, UI screen → component → state), with tests, error handling and logging done the house way. The human reviews this one carefully: agents will copy it.
4. Write `docs/conventions.md` (≤ 1 page): the table from step 1, "copy `<path of reference module>` for new modules", and the commands. Link it from `AGENTS.md` in one line. Add a short `AGENTS.md` inside big modules only when they have rules of their own.

## Existing codebase
1. Read the code (sample the most-changed and the newest files: `git log --name-only`). Extract the conventions actually used, each with 2 example file paths. List the places that contradict each other.
2. Ask the human to choose one way for each contradiction (decision cards if they matter).
3. Encode what tools can check (step 2 above) with the existing tools of the repo first; do not introduce a second linter. Start strict rules as warnings on old code and errors on new code where the tool supports it.
4. Pick the best existing module as the reference and write `docs/conventions.md`.

## Done when
Checks run green on the reference module, `post_edit` runs in a few seconds on one file, `docs/conventions.md` exists and is linked from `AGENTS.md`.
