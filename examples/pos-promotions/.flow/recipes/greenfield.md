# Route: greenfield (sản phẩm mới = epic cho cả sản phẩm)

| # | Step (skill) | Output | Gate |
|---|---|---|---|
| 1 | triage | `product/context.md`, recipe chosen | human confirms plan |
| 2 | discover | `product/map.md`, demo script, draft decision cards | **scope** |
| 3 | explore | research briefs, POC results, decision cards for the open unknowns | |
| 4 | define + spec critic | `product/specs/<cap>/spec.md` + `examples.md` per capability, `product/questions.md`; `spec-lint` clean | **spec** |
| 5 | ux-options | `product/ux/options/index.html`, `design-system.md` | **ux** |
| 6 | architect | `product/architecture/overview.md`, ADRs, stack | **architecture** |
| 7 | plan | `product/plan/slices.md` (slice 0 = skeleton) | (with architecture) |
| 8 | conventions (in slice 0) | lint/boundary config, reference module, `docs/conventions.md` | **conventions** |
| 9 | build / build-codex, per slice | code, frozen QA tests, evidence | |
| 10 | verify, per slice | review, walkthrough, `product/debt.md` | |
| 11 | demo | demo script run, screenshots or video, review pack | **demo** |
| 12 | retro | `work/retro-<date>.md`, kit changes proposed | |

Steps 5 and 6 may run in parallel. Decision cards can be answered at any point; a blocking card pauses only the step it blocks.
