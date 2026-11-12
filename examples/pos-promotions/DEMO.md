# Bộ demo · Epic Khuyến mại POS

8 demo ngắn, mỗi cái là một loại việc khác nhau, chạy trên cùng dự án `examples/pos-promotions`. Buổi demo đầy đủ khoảng 25 phút.

| # | Loại việc | Người xem thấy | Thời gian | File đầu vào |
|---|---|---|---|---|
| 1 | Router | 3 yêu cầu → 3 đường đi khác nhau | 1–2 phút | `demo/inputs/1-router.md` |
| 2 | Spec từ ghi chú họp | ghi chú → spec, bảng ví dụ, câu hỏi cho khách | 6–10 phút | `demo/inputs/2-coupon-notes.md` |
| 3 | Bắt lỗi spec | máy chỉ ra spec mơ hồ, thiếu ví dụ | dưới 1 phút | `demo/break-spec.mjs` |
| 4 | Khách đổi yêu cầu | chỉ ghi phần đổi + danh sách ảnh hưởng | 3–5 phút | `demo/inputs/4-change.md` |
| 5 | Câu hỏi cho khách | danh sách gửi khách ngay | vài giây | — |
| 6 | Bug | test tái hiện đỏ → sửa → xanh → review | 5–8 phút | `demo/inputs/6-bug-report.md` |
| 7 | Việc nhỏ | sửa + test + review + walkthrough | 5–8 phút | `demo/inputs/7-quick.md` |
| 8 | Build slice bằng Codex (chạy nền) | slice mới, test, giờ máy / giờ người | 15–30 phút | `work/slices/S2.md` |

Thời gian trong bảng là ước tính. Lần tập đầu tiên, ghi thời gian thật vào cột cuối của bảng ở Phần B.

## Cái gì đã làm sẵn (nói thật khi demo)

- Spec PRM, STK, 8 thẻ quyết định, câu hỏi cho khách: lane Requirement chạy ngày 11/11.
- Slice S1 (engine giá, biên lai, 40 test): làm sẵn để có code cho demo 6 và 7. **Không tính vào số effort.**
- Một bug cài sẵn cho demo 6: "mua 2 tặng 1" tặng món quét sau cùng thay vì món rẻ nhất. 40 test vẫn xanh, vì không ví dụ nào quét món đắt sau cùng. Đây là chuyện thật hay gặp: test xanh mà vẫn có bug.
- Bản dự phòng: nhánh `pos-demo/after-s2` (S2 đã làm xong) và `pos-demo/after-bugfix` (bug đã sửa).

---

## Phần A · Chuẩn bị một lần (khoảng 30 phút)

Làm trong một **thư mục riêng cho demo**, để không đụng vào thư mục bạn đang làm `pos/`.

**A1. Clone riêng** (PowerShell):
```
cd D:\work
git clone https://github.com/dung-mai/ai-delivery-kit.git ai-delivery-kit-demo
cd ai-delivery-kit-demo
git switch -C demo-run pos-demo/start
```

**A2. Kiểm tra Node và test:**
```
node --version
cd examples\pos-promotions
npm test
```
Cần Node 22 trở lên. Phải thấy `# pass 40`.

**A3. Kiểm tra Claude Code và Codex:**
```
claude --version
codex --version
node .flow\sensors\flow.mjs doctor
```
`doctor` báo đỏ ở đâu thì sửa ở đó trước. Không có Codex thì demo 8 dùng bản dự phòng.

**A4. Chuẩn bị bản dự phòng cho demo 8** (một thư mục chứa S2 đã làm xong):
```
cd D:\work\ai-delivery-kit-demo
git worktree add ..\demo-s2-done pos-demo/after-s2
```

**A5. Mở sẵn 2 cửa sổ terminal**, cả hai ở `D:\work\ai-delivery-kit-demo\examples\pos-promotions`:
- Cửa sổ 1: gõ `claude` (đây là chỗ demo).
- Cửa sổ 2: gõ `node .flow\sensors\flow.mjs watch` (bảng theo dõi job và agent đang chạy, để người xem thấy máy đang làm gì).

**A6. Phóng to chữ terminal** (Ctrl + dấu cộng) để người xem đọc được.

## Phần B · Tập chạy (1–2 giờ, làm một lần)

Chạy lần lượt 8 demo theo Phần D, ghi thời gian thật:

| # | Thời gian thật | Ghi chú |
|---|---|---|
| 1 | | |
| 2 | | |
| 3 | | |
| 4 | | |
| 5 | | |
| 6 | | |
| 7 | | |
| 8 | | |

Demo nào quá 10 phút: thu nhỏ đầu vào (ví dụ demo 2 chỉ giữ 3 dòng ghi chú), hoặc chuyển sang "làm sẵn rồi mở kết quả".

**Trả lại trạng thái ban đầu sau mỗi lần tập:**
```
cd D:\work\ai-delivery-kit-demo
git switch -C demo-run pos-demo/start --discard-changes
git clean -fd examples\pos-promotions
```

## Phần C · Kịch bản buổi demo 25 phút

| Phút | Làm | Nói |
|---|---|---|
| 0–2 | Bật demo 8 (Codex build S2 chạy nền) | "Máy đang tự build một slice. Cuối buổi mình quay lại xem." |
| 2–4 | Demo 1 | "Mỗi loại việc đi một đường riêng; việc nhỏ không phải qua đủ các cổng." |
| 4–12 | Demo 2, rồi demo 5 | "Từ ghi chú họp ra spec có số kiểm được, và danh sách câu hỏi gửi khách." |
| 12–13 | Demo 3 | "Máy chấm spec trước khi người đọc." |
| 13–17 | Demo 4 | "Khách đổi ý: chỉ ghi phần đổi, biết ngay cái gì bị ảnh hưởng." |
| 17–22 | Demo 6 | "Bug được tái hiện bằng test trước, rồi mới sửa." |
| 22–25 | Quay lại demo 8, rồi `/flow effort` | "Slice đã xong. Đây là giờ người và giờ máy." |

Thiếu giờ thì bỏ demo 3 và demo 7.

---

## Phần D · Từng demo

### Demo 1 · Router (1–2 phút)
1. Cửa sổ 1, dán dòng 1 trong `demo/inputs/1-router.md`. Chờ kế hoạch in ra.
2. Dán dòng 2, rồi dòng 3.
3. Chỉ cho người xem: dòng 1 là **quick** (dừng 1 lần), dòng 2 là **feature/epic** (có spec, có câu hỏi cho khách), dòng 3 là **change** (chỉ ghi phần đổi).
- Nếu nó bắt đầu làm luôn: bấm `Esc`, nói "dừng, chỉ cần kế hoạch".

### Demo 2 · Spec từ ghi chú họp (6–10 phút)
1. Mở `demo/inputs/2-coupon-notes.md` cho người xem: 6 dòng, nhiều chỗ "chưa chắc".
2. Dán:
   ```
   /flow "feature: coupon. Ghi chú họp ở demo/inputs/2-coupon-notes.md. Chạy lane 1: spec + bảng ví dụ + thẻ quyết định + câu hỏi cho khách, spec-lint sạch, dừng ở cổng spec."
   ```
3. Trong lúc chờ, mở `product/specs/promotion-apply/examples.md` để giải thích bảng ví dụ trông thế nào.
4. Khi xong, mở `product/specs/coupon/examples.md` (hoặc tên thư mục nó tạo) và `product/questions.md`.
- Quá 10 phút: nói "phần này thường chạy nền", rồi mở spec Khuyến mại đã có làm ví dụ đầu ra.

### Demo 3 · Bắt lỗi spec (dưới 1 phút)
```
node demo/break-spec.mjs
node .flow/sensors/flow.mjs spec-lint
node .flow/sensors/flow.mjs check
node demo/break-spec.mjs --undo
```
Người xem thấy: thiếu Given/When/Then, thẻ D-99 không tồn tại, luật không có ví dụ, từ mơ hồ "nhanh chóng", "phù hợp".

### Demo 4 · Khách đổi yêu cầu (3–5 phút)
1. Dán lệnh trong `demo/inputs/4-change.md`.
2. Mở thư mục `product/changes/CR-01-…` nó tạo: phần đổi (MODIFIED STK-R06) và danh sách ảnh hưởng.
3. Chỉ ra: test cũ đang đóng băng nên AI không tự sửa được; người phải mở chốt. Đó là guard.
- Muốn xem ảnh hưởng ngay không cần AI: `node .flow/sensors/flow.mjs trace --ids STK-R06`.

### Demo 5 · Câu hỏi cho khách (vài giây)
```
/flow questions
```
Mở `product/questions.md`: 6 câu, mỗi câu có phương án, đề xuất và "đang dùng tạm".

### Demo 6 · Bug (5–8 phút)
1. Đọc to bug report trong `demo/inputs/6-bug-report.md`.
2. Dán lệnh `/flow "bug: …"` trong file đó.
3. Chỉ cho người xem lúc test mới **đỏ** (tái hiện được bug), rồi lúc **xanh** sau khi sửa.
4. Mở phần review và walkthrough nó viết.
- Trục trặc: `git diff pos-demo/start pos-demo/after-bugfix` để xem bản sửa mẫu.

### Demo 7 · Việc nhỏ (5–8 phút)
1. Dán lệnh trong `demo/inputs/7-quick.md`.
2. Khi xong: `npm test` cho người xem thấy test xanh; mở diff `src/pricing/receipt.mjs`.

### Demo 8 · Build slice bằng Codex, chạy nền (15–30 phút)
1. Phút đầu buổi, cửa sổ 1, dán:
   ```
   /flow next: build slice S2 theo work/slices/S2.md bằng Codex, chạy nền; trong lúc đó mình làm các demo khác
   ```
2. Cửa sổ 2 (`watch`) hiện job Codex đang chạy.
3. Cuối buổi: `/flow status`, mở `work/slices/S2.md` (kết quả, walkthrough), chạy `npm test` (phải thấy 45 test), `node .flow/sensors/flow.mjs trace` (PRM 39/39).
4. Cuối cùng: `/flow effort` và `node .flow/sensors/flow.mjs timeline`.
- Codex lỗi hoặc chưa xong: mở cửa sổ khác:
  ```
  cd D:\work\demo-s2-done\examples\pos-promotions
  npm test
  ```
  Nói rõ: "đây là bản chạy trước buổi demo".

---

## Khi bị kẹt
- `/flow status` cho biết đang ở đâu, cái gì chờ bạn.
- `node .flow/sensors/flow.mjs doctor` kiểm tra môi trường.
- Mọi thứ rối: chạy lệnh "Trả lại trạng thái ban đầu" ở Phần B rồi làm lại demo đó.
