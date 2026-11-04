---
name: ux-options
description: Produces 2-3 visual directions for the key screens as clickable HTML mockups with screenshots side by side, lets the human pick, then fixes design tokens. Use before building any user-facing screen of a new product or a major redesign.
---

# UX options

Delegate to the **ux** subagent; ask the **researcher** first for how 3–5 comparable products lay out the same screens (screenshots are not copied, patterns are described).

## Steps
1. List the key screens from the demo script (max 3 for the options round).
2. Build 3 directions, each a self-contained HTML file in `product/ux/options/<A|B|C>/<screen>.html` with realistic data from the examples (no lorem ipsum). Directions must differ in a way that matters (density, input style, layout), each with a one-line rationale and the trade-off.
3. Screenshot every screen of every option (Playwright, desktop and the smallest target device) into `product/ux/options/shots/`.
4. Build `product/ux/options/index.html`: one row per screen, options side by side, rationale under each. This is what the human reviews; also export it to PDF if Playwright is available.
5. Gate **ux**: the human picks an option per screen or mixes ("A layout, C colours"). Record it as a decision card.
6. Write `product/ux/design-system.md`: tokens (colour, type scale, spacing, radius), components used, states (empty, loading, error, offline), accessibility notes. Build uses only these.
