---
name: ux-options
description: Produces modern-looking UI directions for the key screens on a real design system (not hand-written CSS), driven by a moodboard the human picks, with a screenshot-and-critique loop, then fixes design tokens and visual baselines. Use before building user-facing screens of a new product or a redesign.
---

# UX options

Level from `.flow/config.json` → `ui.level` (the human can override per request):
- **quick** (default): 1 direction, moodboard + design system, 1 critique round. About the time of building the screen once, plus ~20%.
- **full**: 3 directions side by side, 2 critique rounds, optional v0 exploration, visual regression baselines. Use for the first iteration of a client-facing product.

## 1. Design system first (once per project)
Never design from blank CSS. Use the project's component library; for React projects default to **shadcn/ui + Tailwind** with a theme (colours, radius, font) chosen by the human from 2–3 presets. Everything below is built with these components, so a mockup is already close to the real app.

## 2. Moodboard (once per project, 5 minutes for the human)
Ask the researcher for 6–8 references of comparable products (for a POS: counter POS, tablet POS, self-checkout) and describe each in one line (layout, density, what makes it feel modern). The human picks 2–3 and says what they like ("dense like A, calm colours like B"). Save to `product/ux/moodboard.md`. Do not copy screenshots of other products into the repo; describe them and link them.

## 3. Build the direction(s)
Key screens from the demo script (max 3), realistic data from `examples.md`, all states (empty, loading, error, offline). For `full`, 3 directions that differ in something that matters (density, input style, layout). Optional exploration: if the human has v0 (or a similar generator), give them a ready prompt per screen (stack, components, data, moodboard words) and import the result instead of starting from zero.

## 4. Critique loop (the part that makes it look good)
For each screen: `node .flow/sensors/flow.mjs shots <url-or-file> --out product/ux/shots/<round>` (desktop, tablet, mobile), then **look at the screenshots** and score them against `.flow/templates/ui-critique.md`. Fix every item below 4/5 and shoot again. quick = 1 round, full = 2 rounds. Keep the before/after shots: they show the human what improved.

## 5. Choose and fix
Comparison page `product/ux/index.html` (screens × directions, shots, one-line rationale). Gate **ux**: the human picks or mixes; record it as a decision card. Then write `product/ux/design-system.md` (tokens, components, states, do/don't) and, for `full`, add visual regression tests (Playwright `toHaveScreenshot`) for the chosen screens so later slices cannot drift.
