# Thái Lan: VAT, giảm giá và hoá đơn rút gọn

- Chủ sở hữu: BA (nghiệp vụ) + SA (tính toán)
- Xem lại: 2027-08-01 (trước khi mức 7% hết hạn)

## Thuế suất
- VAT phổ thông đang là **7%**. Luật gốc ghi 10%; mức 7% được gia hạn bằng sắc lệnh hằng năm, lần gần nhất **đến 30/09/2027**. Nguồn: [KPMG, 09/2026](https://kpmg.com/us/en/taxnewsflash/news/2026/09/thailand-reduced-7-percent-vat-rate-extended-through-september-2027.html), [Forvis Mazars](https://www.forvismazars.com/th/en/insights/doing-business-in-thailand/tax/thailand-maintains-7-vat-rate-for-another-year) (kiểm 11/11/2026).
- Hệ quả cho hệ thống: thuế suất là **cấu hình có ngày hiệu lực**, không viết cứng trong code.

## Giảm giá và giá tính thuế
- Giá tính VAT là tổng giá trị nhận được; **giảm giá cho tại thời điểm bán được trừ khỏi giá tính thuế** nếu thể hiện trên hoá đơn. Với **hoá đơn rút gọn (ABB)**, không bắt buộc ghi riêng dòng giảm giá. Nguồn: Revenue Code, Section 79 (bản tiếng Anh tại [Siam Legal](https://library.siam-legal.com/?p=912), kiểm 11/11/2026).
- Hệ quả: VAT tính trên số tiền **sau** mọi khuyến mại của giao dịch.

## Hoá đơn rút gọn (ABB)
- Cửa hàng bán lẻ đăng ký máy POS với Revenue Department (mẫu ภ.พ.06) và in ABB thay cho hoá đơn đầy đủ khi khách không yêu cầu. Chi tiết trường bắt buộc: xem tài liệu đăng ký POS (chưa đưa vào kho; mở khi làm epic Biên lai).

## Chưa chắc chắn
- Làm tròn VAT theo dòng hay theo tổng hoá đơn: luật không quy định chi tiết trong nguồn trên → hỏi kế toán của khách (thẻ D-04 của epic Khuyến mại).
