# Route: epic

Several capabilities, or anything core that needs a design decision. Lanes: **E → 1 → 2 → 3 → 4**, full form, then each feature runs the feature route.

| # | Step (skill) | Output | Gate |
|---|---|---|---|
| 1 | triage | route plan, size, flags | **route** (Dev/TL confirms) |
| 2 | discover | sources read, context, capability map with depth, unknowns as cards | |
| 3 | explore (as many as needed, in parallel) | research briefs, POC results, decision cards | owner decides each card |
| 4 | define (one ba subagent per capability, in parallel) + spec critic | specs, examples, question list; `spec-lint` clean | **spec** (PO + SA) |
| 5 | client confirmation | client question list sent; answers merged | **scope** (client) |
| 6 | architect ‖ ux-options | architecture, ADRs, contracts · UI options | **design** · **ui** |
| 7 | plan | features → slices, skeleton first | |
| 8 | each feature: build ‖ qa → verify | MRs | **merge** per slice |
| 9 | test pack + regression (Lane 4) | combinations, e2e, UAT scripts, trace matrix | **qa** |
| 10 | UAT | client acceptance | **uat** |
| 11 | retro | kit changes proposed | |

Steps 3 and 4 overlap: capabilities without blocking cards start defining at once.
