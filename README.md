# AI Delivery Kit v2

Bộ framework giao việc phần mềm cho AI agent, dùng lại được giữa các dự án. Claude Code điều phối; bạn nói chuyện bình thường hoặc gõ `/flow`; script chỉ giữ luật cứng.

- `kit/` — framework, cài vào dự án bằng `install.mjs`.
- `pos/` — bài thử đầu tiên: POS greenfield trong khoảng 1 tuần. Mốc effort đã chốt trước khi làm: `pos/product/baseline-effort.md`.

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
| `/flow decide` | Các thẻ quyết định đang mở, kèm phương án và khuyến nghị |
| `/flow change "khách muốn …"` | Change request: chỉ ghi phần đổi, chỉ ra ảnh hưởng, làm phần chênh lệch |
| `/flow pack` | Bộ tài liệu HTML/PDF cho BA/khách đọc, tô phần mới |
| `/flow effort 30 "họp với BA"` | Ghi giờ người làm ngoài chat |

Hoặc cứ nói tự nhiên: "build đang lỗi quyền git, xử lý đi", "cho mình 3 phương án màn thanh toán".

## Bên trong

| Phần | Ở đâu | Vai trò |
|---|---|---|
| Conductor | `CLAUDE.md`, skill `flow` | Phiên chính: đọc trạng thái, chọn công thức, giao việc, hỏi bạn ở điểm quyết định |
| Chuyên gia | `.claude/agents/` | researcher, ba, architect, ux, qa, reviewer: mỗi vai một ngữ cảnh, tool giới hạn |
| Khối | `.claude/skills/` | triage, discover, research, define, decide, ux-options, architect, plan, build, build-codex, verify, change, review-pack, retro |
| Công thức | `.flow/recipes/` | greenfield, feature, change, bug, spike, research |
| Template | `.flow/templates/` | bối cảnh, bản đồ, spec, bảng ví dụ, thẻ quyết định, research, kiến trúc, ADR, slice, change, review |
| Guard | `.flow/hooks/` | chặn sửa file đã chốt và `.env`, chặn lệnh nguy hiểm, chạy check khi dừng, đo token và giờ người, thông báo |
| Sensor | `.flow/sensors/flow.mjs` | board, check, examples, trace, freeze, effort, review-pack |
| Sự thật sản phẩm | `product/` | context, map, specs, decisions, changes, research, ux, architecture, plan |
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
