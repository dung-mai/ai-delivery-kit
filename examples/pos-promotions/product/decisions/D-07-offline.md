# D-07 · Máy POS mất kết nối thì áp khuyến mại thế nào?

- Trạng thái: mở
- Loại: assume
- Chặn: không
- Ảnh hưởng: STK-R14
- Người quyết: SA
- Hạn giờ: chốt ở cổng thiết kế
- Mặc định đang dùng: phương án A

## Bối cảnh
Proposal yêu cầu bán được khi mất mạng (handover §3). Khuyến mại mới duyệt khi máy đang offline sẽ không tới máy.

## Phương án
- **A.** Dùng bộ khuyến mại đã đồng bộ gần nhất, xét thời gian theo giờ máy; giao dịch ghi mã bộ khuyến mại. Hệ quả: bán tiếp được; có thể lệch với máy online trong lúc mất mạng.
- **B.** Tắt mọi khuyến mại khi offline. Hệ quả: an toàn về tiền, khách phàn nàn.

## Khuyến nghị
A, kèm báo cáo các giao dịch offline có khuyến mại đã hết hạn theo giờ máy chủ. Độ tin cậy: trung bình; SA chốt ở cổng thiết kế.

## Quyết định
(để trống đến khi chốt) · Người chốt: · Ngày:
