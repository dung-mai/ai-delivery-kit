# Demo 1 · Router: ba yêu cầu, ba đường đi

Dán lần lượt từng dòng vào Claude Code. Thêm "(chỉ cho xem kế hoạch, chưa làm)" để nó dừng sau khi in kế hoạch.

1. /flow "Biên lai đổi chữ TOTAL thành TOTAL / รวม (chỉ cho xem kế hoạch, chưa làm)"
2. /flow "Thêm coupon giảm giá cho khách (chỉ cho xem kế hoạch, chưa làm)"
3. /flow "Khách muốn ngưỡng giỏ hàng tính trên tiền trước giảm giá theo món (chỉ cho xem kế hoạch, chưa làm)"

Mong đợi: 1 → quick (chỉ lane build, dừng 1 lần ở duyệt MR) · 2 → feature hoặc epic (lane 1→4, có câu hỏi cho khách) · 3 → change (chỉ ghi phần đổi, chạy lại lane bị ảnh hưởng).
