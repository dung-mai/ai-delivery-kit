# Quy ước code

- Node ≥ 22, ES modules (`.mjs`), không thư viện ngoài cho phần lõi.
- Tiền: số nguyên satang. Không dùng số thực. Làm tròn chỉ qua `src/pricing/money.mjs`.
- Giờ: chuỗi `YYYY-MM-DDTHH:mm:ss` giờ Asia/Bangkok, so sánh như chuỗi.
- Logic nghiệp vụ là hàm thuần (không I/O) để chạy được cả trên máy POS offline.
- Mỗi luật trong code có comment mã luật (`// STK-R07`).
- Test: `node:test`, tên test bắt đầu bằng mã ví dụ (`STK-EX-07 …`), dữ liệu chung ở `test/fixtures.mjs`. Test QA bị đóng băng sau khi duyệt.
- Module mẫu để chép cấu trúc: `src/pricing/engine.mjs`.
