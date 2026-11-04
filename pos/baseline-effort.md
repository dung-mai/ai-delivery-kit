# Mốc effort POS (chốt trước ngày 1)

Chốt ngày 04/11/2026, **trước khi bắt đầu làm**. Commit này là mốc thời gian: các con số dưới đây không được sửa sau khi có kết quả. Muốn điều chỉnh thì thêm mục "Điều chỉnh" có ngày và lý do, giữ nguyên bảng gốc.

## Cách ước tính

- Ước tính **theo cách làm truyền thống** (team người, không dùng AI sinh code/spec), cho **đúng phạm vi bài POS 1 tuần**, không phải cả dự án 18 tháng.
- Đơn vị: ngày công (md). 1 tháng công = 22 md.
- Mỗi hạng mục chỉ được tính là "đã làm" khi đạt điều kiện hoàn thành ở cột cuối. Làm một phần thì chỉ tính phần trăm đã đạt, ghi rõ.
- Không có bảng man-month của proposal. Proposal chỉ nêu: lộ trình 18 tháng (phân tích/thiết kế M1–M10, build/tích hợp M2–M13), khoảng 20 module, khoảng 30 tích hợp, 5 đội rollout. Vì vậy bảng này là ước tính độc lập. Phạm vi so sánh là các hạng mục dưới đây, không suy ra cho cả chương trình.

## Bảng ước tính (truyền thống)

| # | Hạng mục | Vai trò | md | Điều kiện hoàn thành |
|---|---|---|---:|---|
| A | Phân tích yêu cầu: bản đồ sản phẩm, spec 3 năng lực sâu và 5 năng lực vừa, bảng ví dụ, danh sách câu hỏi khách | BA 8, SA 1 | 9 | Spec có mã ổn định, bảng ví dụ được người duyệt ký |
| B | UX: 3 phương án màn thu ngân và thanh toán, chốt design system | UX 6 | 6 | 3 phương án có ảnh, 1 phương án được chọn, có token |
| C | Kiến trúc: HLD, mô hình dữ liệu, API contract, ADR | SA 5 | 5 | Tài liệu kiến trúc được duyệt |
| D | Engine giá & khuyến mại: coupon, bundle, theo giờ, best-deal, override có quyền; dùng chung cho offline; unit test | BE 12 | 12 | Mọi dòng bảng ví dụ PRC chạy thành test và đạt |
| E | Checkout & thanh toán: idempotency, trạng thái chưa rõ, tra cứu, đối soát, huỷ/hoàn; service giả lập payment | BE 10, BE 3 (giả lập) | 13 | Kịch bản thành công, từ chối, timeout→chưa rõ→đối soát chạy, không thu trùng |
| F | Offline & đồng bộ: lưu cục bộ, hàng đợi bền, chống trùng, cách ly, tự đồng bộ lại | FE 8, BE 5 | 13 | Mất mạng bán 5 đơn, restart, đồng bộ đủ, gửi trùng bị loại, đơn lỗi bị cách ly |
| G | Màn hình thu ngân: quét, giỏ hàng, giải thích khuyến mại, thanh toán, biên lai | FE 8 | 8 | Chạy trọn luồng bán hàng trên trình duyệt |
| H | Sản phẩm, tồn kho, nhập master data CSV | BE 3, FE 2 | 5 | Nhập CSV, trừ tồn khi bán |
| I | Biên lai và e-tax giả lập (nhận/lỗi/trễ) | BE 3 | 3 | Biên lai in được (PDF), trạng thái thuế hiển thị |
| J | Quản trị tối thiểu: sản phẩm, khuyến mại; 2 vai trò | FE 5, BE 3 | 8 | Quản lý sửa khuyến mại, máy POS nhận được |
| K | 3 báo cáo và nhật ký audit | BE 3, FE 2 | 5 | 3 báo cáo đúng số với dữ liệu demo, audit ghi đủ |
| L | Hạ tầng dev: repo, CI, docker compose, môi trường | DevOps 3 | 3 | CI chạy lint, type, test |
| M | QA: test plan, case từ bảng ví dụ, e2e tự động, chạy, vòng lỗi | QA 12 | 12 | Test plan, e2e cho kịch bản demo, báo cáo lỗi |
| N | Quản lý dự án, họp, điều phối (~10%) | PM 10 | 10 | |
|   | **Tổng** | | **112** | |

Theo vai trò: BA 8 · SA 6 · UX 6 · BE 42 (gồm 3 md dựng giả lập payment) · FE 25 · QA 12 · DevOps 3 · PM 10.

Tương đương khoảng **5,1 tháng công**, tức team 5–6 người (BA, SA/TL, 2 BE, 1–2 FE, QA, PM kiêm nhiệm) trong khoảng 4–5 tuần. Biên độ tin cậy ±30%: **80–145 md**.

## Hạng mục proposal mà bảng này chạm tới

Giá & khuyến mại, giao dịch/checkout, thanh toán (giả lập), offline & đồng bộ, sản phẩm/tồn kho, biên lai/thuế (giả lập), quản trị, báo cáo (3 trên 40+). Bảng **không** gồm: migration 276 triệu bản ghi, tích hợp thật (SAP, ngân hàng/EDC, thuế, loyalty, HR, SIEM), phần cứng, SCO/mobile native, NFR ở tải thật, bảo mật/PCI, UAT tại cửa hàng, rollout 14 chi nhánh.

## Cách đo khi làm bằng AI

- **Giờ người:** thời gian người thật sự làm (đọc, duyệt, quyết định, sửa tay, chạy demo). Ghi ở mỗi cổng và cuối mỗi buổi trong `pos/effort-ledger.md`.
- **Giờ máy, token, chi phí:** ghi tự động theo từng bước.
- **So sánh:** `giờ người thực tế ÷ (md đã đạt × 8 giờ)`, tính cho từng hạng mục và cho tổng. Hạng mục chưa đạt điều kiện hoàn thành bị loại khỏi phép so sánh, hoặc chỉ tính phần trăm đã đạt.
- **Báo cáo cuối:** bảng thực tế cạnh bảng này, kèm những gì đã làm nông hơn mức ước tính truyền thống.
