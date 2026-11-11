---
name: research
description: The research mode of explore - answers "how do others do this / what is the standard / what does the law say" with sources, through researcher subagents. Use when explore picks research, or when the user asks to look something up.
---

# Research

Delegate to the **researcher** subagent (several in parallel for independent sub-questions).

## Brief to give
The question, the decision card it feeds, what a useful answer looks like, timebox (default 20 minutes of agent work), output path `product/research/R-<nn>-<slug>.md` from `.flow/templates/research-brief.md`, and: "read `knowledge/` first; do not repeat what it already says".

## Rules for the researcher
- Compare 3–5 real references (products, open-source code, standards, vendor docs, the law). Prefer primary sources; every claim that matters carries a link and the date it was checked.
- Separate what the sources say from the recommendation.
- End with: recommendation, confidence (cao / trung bình / thấp), what would change the answer, which card or spec it feeds.
- Summarise; never copy copyrighted text.

## After
Link the brief from the card. Low confidence + costly decision → propose a POC. A finding that will be needed again → knowledge skill (promote).
