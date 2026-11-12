# Kế hoạch slice · Epic Khuyến mại

- [x] **S1 · Engine giá + biên lai**
  - Năng lực/mã: PRM-R01..R07, R10, R11; STK-R01..R15; ví dụ PRM-EX-01..14, 16..21, 23; STK-EX-01..18
  - Builder: làm sẵn cho demo (Claude, phiên cloud), không tính vào số effort
  - Test QA (đóng băng): `test/promotion-apply.test.mjs`, `test/promotion-definition.test.mjs`
  - Demo mở được: `npm test`, biên lai trong `test/receipt.test.mjs`

- [x] **S2 · Vòng đời khuyến mại**
  - Năng lực/mã: PRM-R08, PRM-R09, PRM-R12; ví dụ PRM-EX-15, PRM-EX-22; kịch bản PRM-S04
  - Builder: codex
  - Brief: `work/slices/S2.md`
  - Test QA: `test/promotion-lifecycle.test.mjs` (viết trước, rồi đóng băng)

- [ ] **S3 · Coupon (CPN)**
  - Năng lực/mã: chờ spec CPN (demo số 2)
  - Builder: codex
