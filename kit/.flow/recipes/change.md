# Route: change request

Lanes: **1** (delta) → only the lanes the impact list names → **3** → **4** (regression).

| # | Step | Output | Gate |
|---|---|---|---|
| 1 | change (delta) | `product/changes/CR-*/proposal.md`, `delta.md` | |
| 2 | change (impact) | tests, slices, screens, data affected; extra effort | **change** |
| 3 | merge delta into specs, release affected frozen tests | updated specs | |
| 4 | plan the difference only | one slice | |
| 5 | build, verify | code, review | |
| 6 | archive the change | `product/changes/archive/` | **merge** |
