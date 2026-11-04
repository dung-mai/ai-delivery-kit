# Recipe: greenfield (sản phẩm mới)

| # | Step (skill) | Output | Gate |
|---|---|---|---|
| 1 | triage | `product/context.md`, recipe chosen | human confirms plan |
| 2 | discover | `product/map.md`, demo script, draft decision cards | **scope** |
| 3 | research | `product/research/R-*.md` for open "research" cards | |
| 4 | define | `product/specs/<cap>/spec.md` + `examples.md` per capability | **spec** |
| 5 | ux-options | `product/ux/options/index.html`, `design-system.md` | **ux** |
| 6 | architect | `product/architecture/overview.md`, ADRs, stack | **architecture** |
| 7 | plan | `product/plan/slices.md` (slice 0 = skeleton) | (with architecture) |
| 8 | build / build-codex, per slice | code, frozen QA tests, evidence | |
| 9 | verify, per slice | `work/reviews/<slice>.md` | |
| 10 | demo | demo script run, screenshots or video, review pack | **demo** |
| 11 | retro | `work/retro-<date>.md`, kit changes proposed | |

Steps 5 and 6 may run in parallel. Decision cards can be answered at any point; a blocking card pauses only the step it blocks.
