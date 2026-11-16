---
name: elicit
description: Lane 1 core. Interviews the human in short rounds to settle the key decisions of a requirement before any spec is written - first question within 2 minutes, facts looked up in the background, decisions asked with a recommended answer, every answer written to an interview log at once, unknowns sent to a client questionnaire, and a shared-understanding playback before define. Use for any new requirement, feature or epic that is not fully specified, when the user runs /flow elicit, or says grill me / interview me / hỏi tôi.
---

# Elicit: settle the decisions early, together

The cost of a requirement is set by a handful of decisions (scope, who, money rules, failure behaviour). Guessing them and asking at the end makes every later step wrong. So: ask them first, in rounds, and write down where every answer came from.

**Facts are your job, decisions are the human's.** Never ask what you can find in the sources, the code or `knowledge/`. Always ask what only a person can choose.

## Visibility (do this the whole time)
- Create the checklist with the task tools: `1 Nhận việc · 2 Bản đồ · 3 Hỏi theo vòng · 4 Đọc lại · 5 Viết spec · 6 Cổng`. Tick as you go.
- Before each step print one line: `▶ Bước 3/6 · Hỏi theo vòng · vòng 2 · 6 câu`.
- After each round run `node .flow/sensors/flow.mjs elicit` (updates the status line and board).
- Never stay silent more than 2 minutes: if background work is still running, say what it is and what it will answer.

## Files
- `product/discovery/<slug>/interview.md` from `.flow/templates/interview.md`: the log. One per topic. `<CAP>` = the capability code (2–5 letters) used for question ids `<CAP>-Q01`.
- `product/discovery/<slug>/story-map.md` (step 2, big topics only).
- `product/client-questions.md` from `.flow/templates/client-questionnaire.md`, in `client_language` from `.flow/config.json` (default English).

## Step 1 · Nhận việc (first question within `elicit.first_question_minutes`, default 2)
1. Restate the request in one sentence.
2. Quick look only (no deep reading yet): list `product/source/`, `product/specs/`, `knowledge/`, top-level code folders, `product/context.md`. Fill **Căn cứ đã đọc** with one line per source ("có gì / chưa đọc kỹ").
3. Start the **discover** skill in the background (researcher / ba subagents, `run_in_background`) for the facts: what the sources say about this topic, what the code already does, what knowledge applies. Do not wait for it.
4. Round 1 = the destination: what is in, what is out, who uses it, what "done" looks like, how deep this iteration goes. For a request that came through the router, round 1 also confirms the route.

## Step 2 · Bản đồ (only when the topic is bigger than one capability, e.g. "checkout")
Propose a story map (`story-map.md`): the user journey left to right, capabilities under each step, a first slice. One round: confirm the split, pick what to specify first. Everything you can see coming but cannot phrase yet goes to **Chưa xác định**; consciously excluded work goes to **Ngoài phạm vi**. Then run steps 3–5 per capability, first one first.

## Step 3 · Hỏi theo vòng
Keep the **decision tree** in the log: each decision and the ones that hang off it.
- A round asks the **frontier**: decisions whose prerequisites are already settled. Never ask a question whose answer depends on another question still open in the same round.
- At most `elicit.max_questions_per_round` (default 7). Order by impact × uncertainty: the decisions that change the most later rules first.
- Each question: number and id, a short title, the options with their consequence, **your recommended answer and why**, and what it affects. Word it so "yes" accepts your recommendation.
- Format:
  - Up to 4 questions that are each a pick among ≤ 4 options → ask with **AskUserQuestion** (put the recommended option first with "(đề xuất)").
  - Otherwise a text round:
    ```
    ❓ **CHK-Q03 · Thanh toán QR quá giờ chờ** — (A) huỷ (B) chờ xác nhận tay (C) …
    ➡️ B, vì tiền có thể đã trừ. Ảnh hưởng: trạng thái giao dịch, đối soát.
    ```
    End with: "Gõ `yes` để nhận hết đề xuất, hoặc trả lời riêng: `Q3: A`, `Q5: không biết`."
- Background facts: questions downstream of an unfinished discover task wait for it; ask the rest now. When a fact arrives that answers a question, record it as a fact with its source instead of asking.
- **Write every answer immediately** into the log (question block + tree line) before asking anything else. If the session dies, nothing answered is lost.
- "không biết" / only the client can decide → status `[?]`, write the default you will use meanwhile, add it to `product/client-questions.md` (recommendation + default), and continue on the default. Rules built on it are assumptions.
- A question nobody can answer by talking ("how should the screen feel", "one page or three") → stop asking it; build a throwaway prototype in ≤ 15 minutes (single HTML in `product/ux/prototypes/`), show it, ask again in one line.
- If the human accepted every recommendation for two rounds, say once: "Bạn đang nhận hết đề xuất; câu nào bạn thật sự chắc, câu nào nên hỏi người khác?" Then continue.
- Stop asking when the frontier is empty, or after `elicit.max_rounds` (default 4): what is left becomes assumptions with defaults, listed for the gate.

## Step 4 · Đọc lại (shared understanding)
Write **Hiểu biết chung** in the log and show it: ≤ 15 lines in plain language (scope, the key rules, 3–5 numeric examples, what is assumed, what is asked to the client). Ask "Đúng chưa?". Do not start the spec until the human confirms; record `- Xác nhận: <who> · <time>`. Corrections go back into the log as answers.

## Step 5 → define
Hand over to the **define** skill: the spec is written from the log. Every rule cites its basis: `[<CAP>-Qnn]` answer, `[TL …]` source document, `[CODE …]`, `[KB …]`, `[D-xx]`, or `[GĐ-nn]` assumption. A new business decision found while writing is asked as one short round, never chosen silently.

## Never
- Read everything silently before the first question.
- Ask the human for a fact you could look up.
- Present a decision as settled when it was your recommendation that nobody confirmed.
- Batch all questions to the end of the flow.
