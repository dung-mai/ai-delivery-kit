---
name: change
description: Handles a change request against approved specs - writes only the delta (ADDED/MODIFIED/REMOVED), shows the impact, and after approval plans and builds only the difference. Use for /flow change or whenever the user or client changes an approved requirement.
---

# Change request

1. Create `product/changes/CR-<nn>-<slug>/` from the template: `proposal.md` (who asked, why, what), `delta.md` per affected capability with three sections ADDED / MODIFIED (full new text of the rule or example, old id kept) / REMOVED (id + reason).
2. Impact (deterministic where possible): `node .flow/sensors/flow.mjs trace --ids <changed ids>` lists tests, slices and screens that mention them. Add architecture and data impact in two lines each. Estimate the extra effort.
3. Gate **change**: the review pack shows only the delta and the impact. The human approves, narrows or rejects.
4. On approval: merge the delta into `product/specs/` (keep ids; new ids continue the numbering; removed ids stay listed as retired), unfreeze only the tests of modified ids (`freeze release`), plan a slice with only the difference, build, verify. Then move the change folder to `product/changes/archive/<date>-CR-<nn>/`.
