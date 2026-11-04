# Recipe: feature (tính năng trong sản phẩm có sẵn)

| # | Step | Output | Gate |
|---|---|---|---|
| 1 | triage | recipe, flags | human confirms |
| 2 | define | new capability spec, or a change request if it modifies approved behaviour | |
| 3 | architect (only with flags: data, money, auth, integration, offline) | ADR / overview update | **spec + design** together |
| 4 | plan | 1–3 slices | |
| 5 | build ‖ qa tests | code, frozen tests | |
| 6 | verify | review | |
| 7 | PR | PR description with ids, evidence, review | **merge** |
