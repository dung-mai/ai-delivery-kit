---
name: discover
description: Lane 1 fact finding, run in the background while elicit asks questions. Reads the sources, the existing code and knowledge/ for one topic and writes the facts with their source - what the sources say, what the code already does, what they do not say. Never asks the human anything. Use when elicit starts a topic, or for a greenfield product context.
---

# Discover (background facts for elicit)

Runs as researcher / ba subagents in the background (`run_in_background`), one per area when they are independent (sources, code, knowledge). Elicit keeps asking the human meanwhile.

## Brief to give each subagent
- Topic and its interview log `product/discovery/<slug>/interview.md`.
- Where to look: `product/source/*` (masked documents), `product/specs/`, `product/context.md`, `knowledge/`, and the code folders in `.flow/config.json` → `code_dirs`.
- Return facts only, each with its source: `[TL <file> §<section>]`, `[CODE <path>]`, `[KB <file>]`. A fact is something written somewhere; an inference is labelled "suy luận" with what it rests on.
- Return also **what the sources do not say** about the topic: those become questions.
- Timebox: 10 minutes of agent work. No questions to the human.

## When it returns
The conductor appends the facts to **Sự thật đã tìm** in the log, updates **Căn cứ đã đọc**, removes questions the facts answered (mark them `[x]` with the fact as answer and its source), and asks the questions that were waiting on these facts in the next round.

## Product context (greenfield, once per product)
Also fill `product/context.md` (goal, roles, variation axes, touchpoints, constraints, glossary) and the source inventory with its "Nguồn chưa nói" list.
