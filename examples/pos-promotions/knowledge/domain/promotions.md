# Khuyến mại tại POS: các khái niệm dùng chung

- Chủ sở hữu: BA
- Xem lại: 2027-05-01

## Loại khuyến mại thường gặp
Giảm % theo món · giảm số tiền theo món · giá đặc biệt · mua X tặng Y (thường tặng món rẻ nhất) · combo giá cố định · giảm theo ngưỡng giỏ hàng · coupon · giá thành viên / nhân viên. Odoo 17 gom thành chương trình có điều kiện (số lượng tối thiểu, số tiền tối thiểu tính có hoặc không có thuế, phạm vi sản phẩm/nhóm) và phần thưởng (giảm trên đơn, trên món rẻ nhất, trên món chỉ định; tặng sản phẩm; mức giảm tối đa). Nguồn: [Odoo 17 docs: Discount and loyalty programs](https://www.odoo.com/documentation/17.0/applications/sales/sales/products_prices/loyalty_discount.html) (kiểm 11/11/2026).

## Cộng dồn và chọn khuyến mại
- Hệ thống lớn (SAP Omnichannel Promotion Pricing) có khái niệm "best price calculation" và nhóm loại trừ để quyết định khuyến mại nào được dùng cùng nhau. Nguồn: [SAP OPP](https://www.sap.com/products/crm/omnichannel-promotion-pricing.html).
- Tài liệu Odoo không nói rõ cách các chương trình cộng dồn khi cùng đủ điều kiện → đây là chỗ **mỗi khách hàng tự quy định**, không có chuẩn chung. Luôn phải hỏi khách (xem `hard-cases/promo-stacking.md`).

## Những điều phải có trong mọi spec khuyến mại
Khung thời gian và múi giờ · phạm vi cửa hàng, món, nhóm khách · thứ tự áp dụng · cộng dồn / loại trừ · làm tròn · phân bổ giảm giá về từng dòng (cần cho trả hàng và thuế) · phiên bản khuyến mại ghi trên giao dịch · hành vi khi máy offline.
