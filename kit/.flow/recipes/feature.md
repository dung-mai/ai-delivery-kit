# Route: feature

New behaviour inside one capability, 1–3 days. Lanes: **1 → 2 → 3 → 4**, each in its light form.

| # | Step (skill) | Output | Gate |
|---|---|---|---|
| 1 | triage | route plan | |
| 2 | elicit (1–2 rounds) → define | interview log, rules with a basis + examples for the new behaviour, critic pass, `spec-lint` clean | **spec** (PO reads the examples) |
| 3 | architect (only if it touches core) · ux-options (only for new screens) | ADR / contract change · UI options | **design** (only if core) |
| 4 | plan | 1–3 slices | |
| 5 | build ‖ qa tests | code, frozen tests | |
| 6 | verify | review, walkthrough | **merge** |
| 7 | test pack (Lane 4) | combinations + e2e for the capability | **qa** |

"Touches core" = money, tax, offline/sync, payment state, integrations, data model, auth/roles.
