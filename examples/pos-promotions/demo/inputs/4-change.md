# Demo 4 · Khách đổi yêu cầu

Dán vào Claude Code:

/flow change "Khách trả lời D-06: chọn phương án B, ngưỡng giỏ hàng tính trên tiền TRƯỚC giảm giá theo món. Ghi phần đổi và danh sách ảnh hưởng, dừng ở bước duyệt, chưa sửa code."

Mong đợi: một thư mục product/changes/CR-01-.../ chỉ ghi phần đổi (MODIFIED STK-R06), danh sách ảnh hưởng: STK-EX-01, STK-EX-02, STK-EX-18 đổi kết quả, test trong test/promotion-apply.test.mjs (đang đóng băng, người phải mở chốt), engine.mjs applyBasketPromotion.
