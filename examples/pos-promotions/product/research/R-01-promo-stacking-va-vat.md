# R-01 · Các hệ thống khác cộng dồn khuyến mại thế nào, và VAT tính trên giá nào

- Phục vụ: D-01, D-02, D-04 · Hạn giờ: ½ ngày · Ngày: 11/11/2026

## Câu hỏi
1. Khi nhiều khuyến mại cùng đủ điều kiện, hệ thống POS phổ biến chọn và cộng dồn thế nào?
2. Ở Thái Lan, VAT tính trên giá trước hay sau giảm giá?

## Nguồn nói gì
| Nguồn | Nói gì |
|---|---|
| [Odoo 17: Discount and loyalty programs](https://www.odoo.com/documentation/17.0/applications/sales/sales/products_prices/loyalty_discount.html) | Chương trình = điều kiện (số lượng / số tiền tối thiểu, có hoặc không có thuế, phạm vi sản phẩm) + phần thưởng (giảm đơn, món rẻ nhất, món chỉ định, tặng sản phẩm, mức giảm tối đa). Không nói rõ thứ tự khi nhiều chương trình cùng đủ điều kiện. |
| [SAP Omnichannel Promotion Pricing](https://www.sap.com/products/crm/omnichannel-promotion-pricing.html) | Một dịch vụ tính giá dùng chung cho mọi kênh, có tính "giá tốt nhất" cho khách. |
| Revenue Code Thái Lan, Section 79 ([bản dịch Siam Legal](https://library.siam-legal.com/?p=912)) | Giảm giá cho tại thời điểm bán, ghi trên hoá đơn, được trừ khỏi giá tính VAT; với ABB không cần ghi riêng. |
| [KPMG 09/2026](https://kpmg.com/us/en/taxnewsflash/news/2026/09/thailand-reduced-7-percent-vat-rate-extended-through-september-2027.html) | VAT 7% gia hạn đến 30/09/2027. |

## Khuyến nghị
- Mô hình độc quyền / cộng dồn + best deal + độ ưu tiên khi hoà (D-01); % cộng dồn tính nối tiếp (D-02), vì đó là cách khách hàng bán lẻ thường hiểu "giảm thêm 5%".
- VAT tính trên số tiền sau mọi khuyến mại; thuế suất là cấu hình có ngày hiệu lực.

Độ tin cậy: trung bình cho cộng dồn (mỗi khách tự quy định), cao cho VAT. Điều sẽ đổi khuyến nghị: chính sách khuyến mại hiện hành của khách (xin bản mô tả hoặc 10 khuyến mại thật đã che số liệu).
