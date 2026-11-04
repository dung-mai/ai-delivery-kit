---
name: review-pack
description: Builds one readable HTML (and PDF when possible) of the product folder for BA, client or reviewer - map, specs, examples, decisions, changes, UX, architecture - with what changed since the last approval highlighted. Use at every gate and when the user asks to read the specs.
---

# Review pack

1. `node .flow/sensors/flow.mjs review-pack` → `work/review-pack/index.html` (and `index.pdf` when Playwright is installed).
2. Tell the human the path and, in 3 lines, what to look at: which capabilities changed, how many examples to check, which decisions are open.
3. After an approval: `flow.mjs review-pack --mark-approved` so the next pack highlights only newer changes.
The pack is generated from the files; never edit it by hand.
