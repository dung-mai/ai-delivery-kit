# Ví dụ · STK

Giá giả lập (đã gồm VAT): Dầu gội 159,00 · Sữa 45,00 · Cola 20,00 · Snack 35,00 · Gạo 5 kg 189,00 THB. Mọi phép tính bằng satang.
Khuyến mại dùng trong bảng: P1 Dầu gội −10% độc quyền ưu tiên 1 · P3 thành viên −5% mọi món, cộng dồn ưu tiên 3 · P4 Sữa −10% cộng dồn ưu tiên 1 · P5 Sữa −5% cộng dồn ưu tiên 2 · P6 Cola mua 2 tặng 1 độc quyền ưu tiên 2 · P7 Cola −40% độc quyền ưu tiên 3 · P8 Cola giảm 20,00 mỗi 3 lon độc quyền ưu tiên 1 · P9 giỏ ≥ 300,00 giảm 5% · P10 giỏ ≥ 300,00 giảm 50,00.

| Mã | Luật | Loại | Đầu vào | Kết quả mong đợi | Vì sao |
|---|---|---|---|---|---|
| STK-EX-01 | STK-R01, STK-R06 | tổ hợp | 1 Dầu gội, 2 Sữa, 3 Cola; P1, P9 | giảm 15,90; không áp P9; phải trả 293,10 | trước giảm 309,00; sau P1 293,10 < 300,00 |
| STK-EX-02 | STK-R06, STK-R08 | biên | 1 Dầu gội, 2 Sữa, 4 Cola; P1, P9 | P1 giảm 15,90; P9 giảm 15,66; phải trả 297,44 | sau P1 313,10 ≥ 300,00; 5% = 1565,5 satang → 1566 |
| STK-EX-03 | STK-R02, STK-R03 | âm | khách thành viên, 1 Dầu gội; P1, P3 | chỉ áp P1, giảm 15,90; P3 không áp | P1 độc quyền (15,90) lợi hơn P3 (7,95) |
| STK-EX-04 | STK-R04, STK-R08 | thường | 1 Sữa; P4, P5 | giảm 6,53; còn 38,47 | 4,50; rồi 5% × 40,50 = 2,025 → 2,03 |
| STK-EX-05 | STK-R05 | thường | 3 Cola; P6, P7 | áp P7, giảm 24,00 | P6 = 20,00; P7 = 3 × 8,00 = 24,00 |
| STK-EX-06 | STK-R05 | biên | 3 Cola; P6, P8 | áp P8, giảm 20,00 | bằng nhau 20,00; P8 ưu tiên 1 cao hơn P6 ưu tiên 2 |
| STK-EX-07 | STK-R07 | thường | 1 Gạo, 1 Dầu gội; P10 | Gạo giảm 27,16; Dầu gội giảm 22,84 | 5000 × 18900 / 34800 = 2715,52 → 2716; 5000 × 15900 / 34800 = 2284,48 → 2284; cộng 5000 |
| STK-EX-08 | STK-R07, STK-R08 | biên | 3 dòng 100,00; giảm cấp giỏ 10,00 | 3,34 · 3,33 · 3,33 | mỗi phần 333,3 → 333; dư 1 satang vào dòng quét trước |
| STK-EX-09 | STK-R09 | biên | 1 Snack; giảm 40,00 theo món | giảm 35,00; dòng còn 0,00 | không âm |
| STK-EX-10 | STK-R10 | thường | 1 Dầu gội, chưa nhận diện; P3; rồi nhận diện thành viên | trước: giảm 0,00; sau: giảm 7,95 | tính lại khi nhận diện; 159,00 × 5% |
| STK-EX-11 | STK-R11 | thường | giỏ của STK-EX-02, phải trả 297,44, thuế 7% | VAT 19,46; trước VAT 277,98 | 29744 × 7 / 107 = 1945,9 → 1946 |
| STK-EX-12 | STK-R11 | biên | phải trả 107,00; bán 30/09/2027 23:59 (7%) và 01/10/2027 00:00 (cấu hình 10% từ 01/10/2027) | VAT 7,00 và 9,73 | 10700 × 7 / 107 = 700; 10700 × 10 / 110 = 972,7 → 973 |
| STK-EX-13 | STK-R12 | biên | khuyến mại kết thúc 18:00; quét 17:58, bấm tổng 18:01 | không áp | xét lúc bấm tổng |
| STK-EX-14 | STK-R12 | biên | khuyến mại kết thúc 18:00; bấm tổng 17:59:59 | áp | trước giờ kết thúc |
| STK-EX-15 | STK-R13 | thường | giỏ của STK-EX-02 | biên lai: dòng "Dầu gội −10%" −15,90; dòng giảm giỏ −15,66 chia vào các dòng; tổng 297,44 | |
| STK-EX-16 | STK-R14 | thường | máy offline từ 09:00; khuyến mại mới duyệt 10:00; bán 10:30 | không áp khuyến mại mới; giao dịch ghi mã bộ khuyến mại lúc 09:00 | |
| STK-EX-17 | STK-R14 | biên | máy offline; khuyến mại kết thúc 18:00; đồng hồ máy 18:00:00 lúc bấm tổng | không áp | kết thúc không tính, theo giờ máy |
| STK-EX-18 | STK-R15 | tổ hợp | 1 Dầu gội, 2 Sữa, 4 Cola; P1, P9, P10 | áp P10, giảm giỏ 50,00; không áp P9 | sau P1 313,10: P9 = 15,66, P10 = 50,00 |
