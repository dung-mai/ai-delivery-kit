# Ví dụ · PRM

Giá giả lập: Sữa 45,00 · Cola 20,00 · Dầu gội 159,00 · Snack 35,00 · Gạo 5 kg 189,00 THB. Giờ Asia/Bangkok.

| Mã | Luật | Loại | Đầu vào | Kết quả mong đợi | Vì sao |
|---|---|---|---|---|---|
| PRM-EX-01 | PRM-R02 | thường | Khuyến mại 01/12 00:00 → 01/01 00:00; bấm tổng 15/12 10:00 | đủ điều kiện | nằm trong khung |
| PRM-EX-02 | PRM-R02 | biên | cùng khuyến mại; bấm tổng 01/12 00:00:00 | đủ điều kiện | bắt đầu được tính |
| PRM-EX-03 | PRM-R02 | biên | cùng khuyến mại; bấm tổng 01/01 00:00:00 | không đủ điều kiện | kết thúc không tính |
| PRM-EX-04 | PRM-R03 | âm | cửa hàng [S01, S02]; máy ở S03 | không đủ điều kiện | S03 ngoài danh sách |
| PRM-EX-05 | PRM-R03 | thường | danh sách cửa hàng rỗng; máy ở S03 | đủ điều kiện | rỗng = mọi cửa hàng |
| PRM-EX-06 | PRM-R04 | âm | chỉ thành viên; khách chưa nhận diện | không đủ điều kiện | |
| PRM-EX-07 | PRM-R04 | thường | chỉ thành viên; đã nhận diện thành viên | đủ điều kiện | |
| PRM-EX-08 | PRM-R05 | tổ hợp | phạm vi: ngành Đồ uống; loại trừ: Cola; giỏ: Cola, Sữa | Sữa trong phạm vi, Cola ngoài | loại trừ thắng |
| PRM-EX-09 | PRM-R06 | biên | ngưỡng 500,00 THB; tiền tính ngưỡng 500,00 | đủ điều kiện | 500,00 ≥ 500,00 |
| PRM-EX-10 | PRM-R06 | biên | ngưỡng 500,00 THB; tiền tính ngưỡng 499,99 | không đủ điều kiện | 499,99 < 500,00 |
| PRM-EX-11 | PRM-R07 | thường | Cola mua 2 tặng 1; 7 lon; không giới hạn | áp 2 lần: tặng 2 lon (giảm 40,00) | floor(7 / 3) = 2 |
| PRM-EX-12 | PRM-R07 | biên | Cola mua 2 tặng 1; 7 lon; tối đa 1 lần / giao dịch | áp 1 lần: giảm 20,00 | giới hạn 1 |
| PRM-EX-13 | PRM-R07 | biên | Cola mua 2 tặng 1; 2 lon | không áp | floor(2 / 3) = 0 |
| PRM-EX-14 | PRM-R08 | âm | khuyến mại Chờ duyệt | không có trên máy POS, không áp | chỉ Đã duyệt được gửi xuống |
| PRM-EX-15 | PRM-R08 | âm | người tạo = người duyệt | từ chối thao tác duyệt | D-05 |
| PRM-EX-16 | PRM-R09 | thường | phiên bản 1 đang chạy (−10%), phiên bản 2 (−15%) Chờ duyệt; bán 1 Dầu gội | giảm 15,90; giao dịch ghi phiên bản 1 | 159,00 × 10% |
| PRM-EX-17 | PRM-R10 | biên | Snack 35,00; giảm 40,00 THB theo món | giảm 35,00; giá sau giảm 0,00 | không âm |
| PRM-EX-18 | PRM-R11 | biên | giảm 20%, tối đa 100,00; dòng 600,00 | giảm 100,00 | 20% = 120,00 > 100,00 |
| PRM-EX-19 | PRM-R01 | thường | giảm % theo món: Dầu gội −10% | giảm 15,90; còn 143,10 | 159,00 × 10% |
| PRM-EX-20 | PRM-R01 | thường | giá đặc biệt: Gạo 169,00 | giảm 20,00 | 189,00 − 169,00 |
| PRM-EX-21 | PRM-R01 | tổ hợp | combo Snack + Cola giá 49,00 | giảm 6,00, chia: Snack 3,82, Cola 2,18 | 55,00 − 49,00; chia theo STK-R07: 6,00 × 35/55 = 3,818 → 3,82; 6,00 × 20/55 = 2,182 → 2,18 |
| PRM-EX-22 | PRM-R12 | âm | gửi duyệt khi thiếu kết thúc và phạm vi món | không gửi được; báo 2 trường thiếu | |
| PRM-EX-23 | PRM-R01, PRM-R07 | tổ hợp | Đồ uống mua 2 tặng 1; giỏ: 1 Sữa 45,00, 2 Cola 20,00 | tặng 1 Cola, giảm 20,00 | tặng món rẻ nhất trong 3 món |
