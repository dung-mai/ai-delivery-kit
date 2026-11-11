# Route: quick

Small and clear (≤ ~1 day), no new business rule, nothing core (money, tax, offline/sync, payment state, integration, data model, auth). Lanes: **3 build** only, Lane 4 runs the automatic tests.

| # | Step | Output | Gate |
|---|---|---|---|
| 1 | triage | 2-line plan | (none: start right away) |
| 2 | build / build-codex | code + tests (test first only if behaviour changes) | |
| 3 | verify | checks, AI review on another engine, walkthrough | **merge** |

Escalate to **feature** the moment it needs a new rule or touches something core; say so in one line on the board.
