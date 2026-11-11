# D-08 · Best deal so sánh trên từng nhóm món hay trên cả giỏ?

- Trạng thái: mở
- Loại: assume
- Chặn: không
- Ảnh hưởng: STK-R05
- Người quyết: SA
- Hạn giờ: chốt ở cổng thiết kế, có thể cần POC ½ ngày
- Mặc định đang dùng: phương án A

## Bối cảnh
Phát hiện ở vòng soi spec: "mua 2 tặng 1" và combo trải trên nhiều đơn vị hàng, nên tối ưu cả giỏ có thể bùng nổ tổ hợp với giỏ 50+ món. Lập trình viên sẽ phải đoán nếu spec không nói.

## Phương án
- **A.** So sánh trên từng nhóm đơn vị mà các khuyến mại tranh nhau; nhóm độc lập tính riêng. Hệ quả: nhanh, đủ cho đa số giỏ; có thể bỏ sót phương án tốt hơn khi nhóm chồng chéo.
- **B.** Tối ưu toàn giỏ có giới hạn số tổ hợp (vd. 2 000), vượt thì về A. Hệ quả: lợi nhất cho khách, khó test và khó giải thích trên biên lai.

## Khuyến nghị
A; nếu bộ khuyến mại thật của khách có nhiều nhóm chồng chéo, làm POC B. Độ tin cậy: trung bình.

## Quyết định
(để trống đến khi chốt) · Người chốt: · Ngày:
