# AI Delivery Kit v3

Bộ framework giao việc phần mềm cho AI agent, dùng lại được giữa các dự án. Claude Code điều phối; bạn nói chuyện bình thường hoặc gõ `/flow`; script chỉ giữ luật cứng.

- `kit/` — framework, cài vào dự án bằng `install.mjs`.
- `pos/` — bài thử đầu tiên: POS greenfield trong khoảng 1 tuần. Mốc effort đã chốt trước khi làm: `pos/product/baseline-effort.md`.
- `examples/pos-promotions/` — dự án mẫu epic Khuyến mại: lane Requirement (spec, 41 ví dụ, thẻ quyết định, câu hỏi cho khách, knowledge), slice S1 (engine giá + 40 test) và **bộ demo 8 loại việc**: xem `examples/pos-promotions/DEMO.md`.

## v3: router + 4 lane

- **Lane** = ai sở hữu loại việc, có những bước nào, ai ký: 1 Requirement · 2 Design · 3 Build · 4 Test. **Route** = việc này chạy những bước nào: `quick`, `bug`, `change`, `feature`, `epic`, `explore`, `greenfield` (`.flow/recipes/`). Skill `triage` là router; conductor chạy một mạch, chỉ dừng ở cổng của route đó.
- **Explore không phải lane**: bước nào gặp điều chưa biết thì gọi skill `explore` (assume · analyze · research · POC · prototype · hỏi khách), có hạn giờ, luôn kết thúc bằng thẻ quyết định; chỉ bước cần câu trả lời phải chờ.
- **Lane Requirement làm kỹ**: `discover` kiểm kê nguồn và ghi rõ "nguồn chưa nói"; `define` viết spec theo template mới (vai trò, luật, kịch bản gắn `[auto|semi|manual]`, màn hình và trường, điểm chạm, biến thể, giả định, câu hỏi mở) và bảng ví dụ có cột `Loại` (thường / biên / âm / tổ hợp); agent `spec-critic` soi độc lập; `flow.mjs spec-lint` chấm (kích thước, Given/When/Then, luật số không có ví dụ biên, luật cấm không có ví dụ âm, từ mơ hồ, thẻ không tồn tại); `flow.mjs questions` gom câu hỏi cho khách thành một danh sách có phương án, đề xuất và mặc định đang dùng.
- **knowledge/**: kho tri thức nhỏ, có nguồn, lớn dần theo dùng (skill `knowledge`).
- Checklist từng cổng: `.flow/templates/gates.md`.

## Cài vào một dự án

```bash
node install.mjs ../my-project --project my-project     # lần đầu
node install.mjs ../my-project --update                 # cập nhật framework, không đụng product/, work/, cấu hình
```

Cần Node 20+ và Claude Code. Codex CLI là tuỳ chọn (dùng làm builder). Playwright là tuỳ chọn (xuất PDF, chụp màn hình).

## Dùng hằng ngày

Mở Claude Code trong thư mục dự án (terminal, VS Code extension hoặc app desktop):

| Gõ | Việc |
|---|---|
| `/flow "Làm POS từ tài liệu trong product/source"` | Phân loại việc, chọn công thức, in kế hoạch, hỏi bạn chốt |
| `/flow` hoặc `/flow status` | Đang ở đâu, cái gì chờ bạn, đã tốn bao nhiêu |
| `/flow next` | Làm bước kế, dừng ở chỗ cần bạn |
| `/flow explore "…"` | Câu hỏi chưa biết: chọn cách rẻ nhất (research, POC, prototype, hỏi khách…), có hạn giờ, ra thẻ quyết định |
| `/flow decide` | Các thẻ quyết định đang mở, kèm phương án và khuyến nghị |
| `/flow questions` | Danh sách câu hỏi cho khách, gửi được ngay |
| `/flow change "khách muốn …"` | Change request: chỉ ghi phần đổi, chỉ ra ảnh hưởng, làm phần chênh lệch |
| `/flow pack` | Bộ tài liệu HTML/PDF cho BA/khách đọc, tô phần mới |
| `/flow effort 30 "họp với BA"` | Ghi giờ người làm ngoài chat |

Hoặc cứ nói tự nhiên: "build đang lỗi quyền git, xử lý đi", "cho mình 3 phương án màn thanh toán".

## Bên trong

| Phần | Ở đâu | Vai trò |
|---|---|---|
| Conductor | `CLAUDE.md`, skill `flow` | Phiên chính: đọc trạng thái, chọn công thức, giao việc, hỏi bạn ở điểm quyết định |
| Chuyên gia | `.claude/agents/` | researcher, ba, spec-critic, architect, ux, qa, reviewer: mỗi vai một ngữ cảnh, tool giới hạn |
| Khối | `.claude/skills/` | triage (router), discover, define, explore, research, decide, knowledge, ux-options, architect, plan, conventions, build, build-codex, delegate, verify, change, review-pack, retro |
| Route | `.flow/recipes/` | quick, bug, change, feature, epic, explore, greenfield |
| Template | `.flow/templates/` | bối cảnh, bản đồ, spec, bảng ví dụ, thẻ quyết định, research, kiến trúc, ADR, slice, change, review |
| Guard | `.flow/hooks/` | chặn sửa file đã chốt và `.env`, chặn lệnh nguy hiểm, format/lint file vừa sửa, chạy check khi dừng, đo token và giờ người, thông báo |
| Sensor | `.flow/sensors/flow.mjs` | board, check, spec-lint, questions, examples, trace, freeze, effort, review-pack, shots, run, watch, doctor |
| Sự thật sản phẩm | `product/` | context, map, specs, decisions, questions, changes, research, ux, architecture, plan |
| Tri thức | `knowledge/` | domain, law, hard-cases, integrations, glossary |
| Trạng thái | `work/`, `.flow/state/` | BOARD.md, sổ effort, review, bằng chứng |

## 12 pattern

1. **Conductor + chuyên gia**: phiên chính điều phối, mỗi vai một subagent.
2. **Artifact là hợp đồng**: mọi bước nhận và trả file, nên đổi tool hay hết quota không mất mạch.
3. **Guard ngoài model**: luật cứng nằm trong hook và script, không phải lời dặn.
4. **Phân loại mơ hồ**: giả định / research / hỏi khách / spike / để sau.
5. **Thẻ quyết định**: câu hỏi, phương án, khuyến nghị, hệ quả trên một trang.
6. **Research trước khi chốt**: so 3–5 hệ thống thật, có nguồn.
7. **Spec sống + delta**: `specs/` là hiện trạng; thay đổi ghi ADDED / MODIFIED / REMOVED (ý từ OpenSpec).
8. **Ví dụ chạy được**: BA duyệt bảng ví dụ; chính bảng đó thành test (`examples.json`).
9. **Nhiều phương án rồi chọn**: UI và kiến trúc đưa 2–3 phương án đặt cạnh nhau.
10. **Slice dọc, khung chạy trước**: có thứ chạy được từ ngày đầu.
11. **Kiểm tra độc lập**: reviewer khác engine builder, chỉ đọc, sensor tất định đi trước.
12. **Sổ effort + vòng học**: giờ người, giờ máy, token mỗi phiên; retro thành luật mới.

## Mã yêu cầu

`PRC-R01` luật · `PRC-S01` kịch bản · `PRC-EX-01` ví dụ · `D-01` quyết định · `CR-01` thay đổi. Test ghi mã trong tên hoặc nạp `examples.json`, nên `flow.mjs trace` biết yêu cầu nào đã có test.

## Tuỳ chỉnh cho dự án

`.flow/config.json`: ngôn ngữ, engine build/review, model từng vai, lệnh check của dự án (`checks`), thư mục code, đường dẫn mốc effort, thông báo. Luật riêng của dự án viết vào `AGENTS.md`; thông tin sản phẩm viết vào `product/context.md`.

## Chất lượng code

- **Máy bắt lỗi trước:** formatter, linter, TypeScript strict, luật ranh giới module, giới hạn độ dài, phát hiện code trùng và code chết. Skill `conventions` dựng các luật này ở slice 0 (dự án mới) hoặc rút từ code có sẵn (dự án cũ).
- **Bắt ngay khi sửa:** hook PostToolUse chạy `post_edit.format` và `post_edit.lint` trong `.flow/config.json`, **chỉ cho file vừa sửa**, mỗi lệnh tối đa 15 giây. Để trống thì hook không làm gì. Check toàn dự án (`checks`) chỉ chạy khi dừng.
- **Mẫu thay cho lời dặn:** một module tham chiếu được người duyệt kỹ; `docs/conventions.md` chỉ ra module đó, module mới làm theo.
- **Không để nợ vô hình:** mỗi slice có walkthrough một trang; làm tắt có chủ ý thì ghi vào `product/debt.md`.

## UI

`ux-options` dùng design system có sẵn (mặc định shadcn/ui + Tailwind + theme bạn chọn), moodboard bạn chọn từ các sản phẩm tham khảo, và vòng chụp ảnh (`flow.mjs shots`) rồi tự chấm theo `.flow/templates/ui-critique.md`. Có hai mức trong `ui.level`: `quick` (mặc định, 1 phương án, 1 vòng chấm) và `full` (3 phương án, 2 vòng chấm, tuỳ chọn v0, test so ảnh).

## Phân việc giữa Claude, Codex, DeepSeek

`.flow/config.json` → `roles`: mỗi vai (research, ba, architect, ux, qa, build, review, docs) giao cho `claude`, `codex` hoặc `deepseek`. Mặc định Claude làm phần cần phán đoán (spec, quyết định, kiến trúc, review), Codex làm phần khối lượng (code, test, UI, tài liệu). Máy nào khác thì ghi đè trong `.flow/config.local.json` (không commit), ví dụ ở nhà cho research chạy DeepSeek: xem `.flow/config.local.example.json`.

Codex chạy trong sandbox: không có mạng, không ghi được `.git`, không ghi ra ngoài thư mục. Vì vậy Claude chuẩn bị môi trường (cài gói, bật DB, chạy migration), Codex chỉ sửa code và chạy check, Claude commit. Mặc định Codex sửa ngay trong thư mục chính (`codex.mode: inplace`), chỉ dùng worktree khi chạy song song thật. Chạy `node .flow/sensors/flow.mjs doctor` một lần trên mỗi máy: nó kiểm tra sandbox của Codex có mở mạng không (test gọi DB trên localhost cần) và trên Windows đã cấu hình sandbox `elevated` chưa.

## Theo dõi

- **Status line** (luôn hiện dưới ô nhập của Claude Code, tự làm mới 5 giây): bước hiện tại, slice, số việc chờ bạn, subagent và job đang chạy, % quota Claude 5 giờ, % context.
- **`node .flow/sensors/flow.mjs watch`** ở terminal thứ hai: màn hình sống gồm subagent, job (dòng log mới nhất), việc chờ bạn, quota, sự kiện gần đây.
- **`/tasks`** trong Claude Code: shell và subagent đang chạy nền. **`claude agents`**: khi chạy nhiều phiên Claude Code cùng lúc.
- **`flow.mjs jobs`, `flow.mjs logs <tên>`**: job dài (Codex, test) chạy qua `flow.mjs run <tên> -- <lệnh>` có log trong `work/jobs/`.
- **`flow.mjs timeline`**: thời gian đi đâu: từng bước, job, subagent, việc nào chạy song song.

## Bị dừng giữa chừng

Mỗi bước xong được commit checkpoint. Khi mở lại phiên (kể cả `claude --continue`), hook SessionStart đánh dấu job và subagent bị cắt ngang, liệt kê code chưa commit và worktree còn sót; conductor xử lý từng mục rồi làm tiếp. Gõ `/flow resume` để xem lại bất cứ lúc nào. Quota Claude trên 85% thì conductor tự dừng ở checkpoint và giao phần code còn lại cho Codex.
