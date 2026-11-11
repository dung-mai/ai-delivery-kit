# Route: bug

Behaviour differs from the approved spec. Lanes: **4 → 3 → 4**. If the spec itself is wrong, it is a **change**.

| # | Step | Output | Gate |
|---|---|---|---|
| 1 | reproduce (Lane 4) | steps + data; the rule / example id it breaks | |
| 2 | failing test first (Lane 3) | test named after the id (`PRM-EX-07 …`), frozen | |
| 3 | fix, smallest change | code | |
| 4 | verify | checks, AI review (another engine for money/auth/data), regression of that capability | **merge** |
| 5 | confirm (Lane 4) | evidence; close the defect | (QA, only when found in UAT) |
