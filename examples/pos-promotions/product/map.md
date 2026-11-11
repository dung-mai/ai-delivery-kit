# Bản đồ · Epic Khuyến mại

Một trang. Đọc file này trước khi đọc spec.

| Mã | Năng lực | Mục đích (1 dòng) | Độ sâu lần này | Rủi ro chính | Spec |
|---|---|---|---|---|---|
| PRM | Định nghĩa và điều kiện khuyến mại | Khuyến mại gồm những gì, khi nào và cho ai thì đủ điều kiện | sâu | luật duyệt, phiên bản | `specs/promotion-definition/spec.md` |
| STK | Áp dụng và cộng dồn | Giỏ hàng có nhiều khuyến mại thì áp cái nào, theo thứ tự nào, ra bao nhiêu tiền | sâu | sai tiền, khác hiểu với khách | `specs/promotion-apply/spec.md` |
| CPN | Coupon | Mã giảm giá khách xuất trình | vừa (spec sau) | dùng lại mã | chưa |
| OVR | Override của thu ngân | Giảm tay có quyền và lý do | vừa (spec sau) | gian lận | chưa |
| RTP | Trả hàng có khuyến mại | Hoàn đúng số tiền khi trả một phần giỏ đã giảm giá | sâu (epic Trả hàng) | hoàn sai | chưa |
| LOY | Tích / đổi điểm | | ngoài phạm vi (epic Loyalty) | | |

Độ sâu: `sâu` (logic thật, test bằng bảng ví dụ) · `vừa` (đủ chạy luồng chính) · `giả lập` · `ngoài phạm vi`.

## Chia feature (epic)
1. PRM: loại khuyến mại, phạm vi, khung giờ, duyệt và phiên bản.
2. STK: thứ tự, độc quyền / cộng dồn, best deal, ngưỡng giỏ, phân bổ, làm tròn, VAT.
3. CPN, OVR: sau khi D-01 và D-03 được khách chốt.

## Kịch bản demo
1. Marketing tạo "Sữa −10%" (cộng dồn) và "Dầu gội −10%" (độc quyền), người khác duyệt.
2. Thu ngân quét Dầu gội, 2 Sữa, 4 Cola; màn hình hiện giảm từng dòng.
3. Nhận diện thành viên: giỏ tính lại, khuyến mại thành viên xuất hiện.
4. Bấm tổng: giỏ vượt 300 THB, giảm 5% toàn giỏ, chia về từng dòng.
5. Biên lai ABB: tổng sau giảm, VAT 7% tính trên số sau giảm.
6. Máy mất mạng: vẫn áp khuyến mại đã đồng bộ, giao dịch ghi phiên bản.

## Để sau
- Khuyến mại theo phương thức thanh toán (thẻ ngân hàng), theo kênh online.
