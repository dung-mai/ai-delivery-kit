# Bẫy: khuyến mại chồng nhau

- Chủ sở hữu: SA
- Xem lại: 2027-05-01

## Vì sao khó
Cùng một món có thể đủ điều kiện cho nhiều khuyến mại (giảm %, mua 2 tặng 1, giá thành viên, ngưỡng giỏ hàng). Ba câu hỏi luôn phải trả lời: cái nào được dùng cùng nhau, nếu loại trừ thì chọn cái nào, và % thứ hai tính trên giá gốc hay giá đã giảm.

## Ví dụ cho thấy chênh lệch
Sữa 45,00 THB, hai khuyến mại cộng dồn −10% và −5%:
- Nối tiếp: 4,50 rồi 5% × 40,50 = 2,03 → giảm 6,53.
- Trên giá gốc: 4,50 + 2,25 → giảm 6,75.
Chênh 0,22 THB một món; nhân với số giao dịch thì thành tiền thật, và test sẽ hỏng nếu hai bên hiểu khác nhau.

## Cách phổ biến
Mỗi khuyến mại thuộc loại **độc quyền** hoặc **cộng dồn**; khi phải chọn giữa các phương án loại trừ nhau, chọn phương án **có lợi nhất cho khách** (best deal), hoà thì theo **độ ưu tiên**. Giảm theo món tính trước, giảm theo giỏ hàng tính sau trên số đã giảm. (Tổng hợp từ Odoo 17, SAP OPP; mỗi khách hàng vẫn tự chốt.)

## Phân bổ về từng dòng
Giảm giá cấp giỏ hàng / combo phải chia về từng dòng (theo tỉ lệ tiền) để trả hàng một phần và báo cáo thuế đúng; phần dư do làm tròn dồn vào một dòng xác định.
