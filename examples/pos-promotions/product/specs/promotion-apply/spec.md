# Áp dụng và cộng dồn khuyến mại (STK)

## Tóm tắt
Khi giỏ hàng có nhiều khuyến mại đủ điều kiện (PRM), năng lực này quyết định áp cái nào, theo thứ tự nào, mỗi dòng giảm bao nhiêu, làm tròn và tính VAT ra sao, và ghi gì lên giao dịch. Mọi phép tính dùng satang nguyên.
Nguồn: handover §2 ("best-deal"), §5 (snapshot, số nguyên); `knowledge/hard-cases/promo-stacking.md`; `knowledge/law/th-vat-discount.md`; `product/research/R-01-promo-stacking-va-vat.md`.

## Vai trò
| Vai trò | Được làm | Không được làm |
|---|---|---|
| Thu ngân | xem khuyến mại được áp trên từng dòng, nhận diện thành viên | chọn hay bỏ khuyến mại |
| Khách hàng | xem dòng giảm giá trên màn hình khách và biên lai | |

## Luật
| Mã | Khi | Thì | Ghi chú / nguồn |
|---|---|---|---|
| STK-R01 | Tính giỏ hàng | Áp khuyến mại theo món (5 loại đầu của PRM-R01) trước, rồi khuyến mại theo ngưỡng giỏ hàng | |
| STK-R02 | Đọc khuyến mại | Mỗi khuyến mại là độc quyền hoặc cộng dồn | D-01 |
| STK-R03 | Một đơn vị hàng được áp khuyến mại độc quyền | Không áp khuyến mại theo món nào khác cho đơn vị đó | D-01 |
| STK-R04 | Nhiều khuyến mại % cộng dồn trên cùng đơn vị hàng | Áp lần lượt theo độ ưu tiên; mỗi % tính trên giá đã giảm bởi khuyến mại trước | D-02 |
| STK-R05 | Có nhiều phương án loại trừ nhau cho cùng nhóm đơn vị hàng (một khuyến mại độc quyền, hoặc tập khuyến mại cộng dồn) | Chọn phương án có tổng giảm lớn nhất cho khách trên nhóm đơn vị mà các khuyến mại tranh nhau; bằng nhau thì độ ưu tiên cao hơn (số nhỏ hơn); vẫn bằng thì khuyến mại duyệt trước | D-01, D-08; "best-deal" handover §2 |
| STK-R06 | Xét ngưỡng giỏ hàng | Tiền tính ngưỡng = tổng sau khuyến mại theo món; đạt khi ≥ ngưỡng | D-06 |
| STK-R07 | Có khoản giảm cấp combo hoặc cấp giỏ hàng | Chia về các dòng theo tỉ lệ tiền sau giảm của dòng; mỗi phần làm tròn theo STK-R08; phần dư dồn vào dòng có tiền lớn nhất, bằng nhau thì dòng quét trước | cần cho trả hàng, báo cáo thuế |
| STK-R08 | Làm tròn một khoản giảm | Làm tròn nửa lên tới 1 satang (0,5 satang → lên) | D-04 |
| STK-R09 | Tổng giảm của một dòng lớn hơn tiền dòng | Giảm tối đa bằng tiền dòng; tiền dòng sau giảm không âm | PRM-R10 |
| STK-R10 | Thêm / bớt món, nhận diện khách, hay đổi số lượng trước khi thanh toán | Tính lại toàn bộ giỏ; màn hình thu ngân và màn hình khách hiện kết quả mới | |
| STK-R11 | Tính VAT của giao dịch | VAT = tổng sau mọi giảm giá × t / (100 + t), t lấy từ cấu hình theo ngày bán; làm tròn theo STK-R08 một lần trên tổng hoá đơn | giá đã gồm VAT; Section 79; D-04 |
| STK-R12 | Xét hiệu lực khuyến mại | Thời điểm xét là lúc thu ngân bấm tổng; mọi khuyến mại xét lại tại thời điểm đó | D-03 |
| STK-R13 | In biên lai | Mỗi dòng có khuyến mại in tên khuyến mại (TH) và số tiền giảm; tổng ABB là tổng sau giảm | ABB không bắt buộc ghi giảm giá; khách thấy rõ hơn |
| STK-R14 | Máy POS mất kết nối | Dùng bộ khuyến mại đồng bộ gần nhất, xét giờ theo đồng hồ máy; giao dịch ghi mã bộ khuyến mại | D-07 |
| STK-R15 | Nhiều khuyến mại theo ngưỡng giỏ hàng cùng đạt | Chỉ áp một, chọn cái giảm nhiều nhất; bằng nhau theo STK-R05 | D-01 |

## Kịch bản
- **STK-S01** [auto] Given Dầu gội có khuyến mại độc quyền −10% và khuyến mại thành viên −5% cộng dồn When khách thành viên mua 1 Dầu gội Then chỉ áp −10% (giảm 15,90).
- **STK-S02** [auto] Given Sữa có −10% (ưu tiên 1) và −5% (ưu tiên 2), cả hai cộng dồn When mua 1 Sữa Then giảm 6,53, còn 38,47.
- **STK-S03** [auto] Given khuyến mại giỏ ≥ 300,00 giảm 5% When tổng trước giảm 309,00 nhưng sau giảm theo món 293,10 Then không áp khuyến mại giỏ.
- **STK-S04** [auto] Given giỏ được giảm 50,00 cấp giỏ hàng When tính xong Then tổng các phần chia về dòng đúng bằng 50,00.
- **STK-S05** [semi] Given giỏ đã quét When thu ngân nhận diện thành viên Then màn hình thu ngân và màn hình khách hiện giảm giá mới trong cùng lượt cập nhật.
- **STK-S06** [semi] Given máy mất kết nối từ 09:00 When khuyến mại mới được duyệt lúc 10:00 Then máy không áp khuyến mại đó và giao dịch ghi mã bộ khuyến mại cũ.
- **STK-S07** [manual] Given giao dịch có khuyến mại When in biên lai trên máy in thật của cửa hàng Then tên khuyến mại tiếng Thái hiển thị đủ trên một dòng 42 ký tự hoặc xuống dòng đúng.

## Trạng thái
Không có vòng đời riêng; giỏ hàng tính lại mỗi khi đổi (STK-R10) và chốt khi bấm tổng (STK-R12).

## Màn hình và trường
| Màn hình | Trường / hành động | Bắt buộc | Kiểm tra hợp lệ | Ai thấy |
|---|---|---|---|---|
| Màn bán hàng (thu ngân) | dưới mỗi dòng: tên khuyến mại, số tiền giảm | | | Thu ngân |
| | tổng giảm của giỏ, tổng phải trả | | | Thu ngân |
| Màn hình khách | dòng giảm giá, tổng tiết kiệm | | | Khách |
| Biên lai / ABB | tên khuyến mại (TH), số tiền giảm, tổng sau giảm, VAT | | STK-R13 | Khách |

## Điểm chạm
| Với | Chiều | Dữ liệu | Khi lỗi |
|---|---|---|---|
| Thành viên (loyalty) | vào | nhóm khách | không nhận diện được: tính như khách thường, thu ngân thấy thông báo |
| Giao dịch → ERP / báo cáo | ra | từng dòng: mã khuyến mại, phiên bản, số tiền giảm đã chia | gửi lại từ hàng đợi |
| Bộ khuyến mại từ máy chủ | vào | mã bộ, danh sách khuyến mại Đã duyệt | giữ bộ cũ (STK-R14) |

## Biến thể
Nhóm khách (thành viên / thường) · trạng thái máy (online / offline) · thuế suất theo ngày bán.

## Giả định
- Giá bán lẻ đã gồm VAT.
- Mua X tặng Y tặng món rẻ nhất trong phạm vi (PRM-R01).
- Thứ tự quét dùng để phân xử khi chia phần dư (STK-R07).
- Best deal so sánh trên từng nhóm đơn vị hàng mà các khuyến mại tranh nhau, không tìm phương án lợi nhất cho cả giỏ khi các nhóm chồng chéo (D-08, SA chốt ở cổng thiết kế).
- Biên lai in dòng giảm giá dù ABB không bắt buộc (STK-R13).

## Câu hỏi mở
- D-01 · Cộng dồn và chọn khuyến mại · đề xuất: độc quyền / cộng dồn + best deal · đang dùng: như đề xuất.
- D-02 · % cộng dồn nối tiếp hay trên giá gốc · đề xuất: nối tiếp.
- D-03 · Xét lúc bấm tổng hay lúc quét · đề xuất: bấm tổng.
- D-04 · Làm tròn, VAT theo dòng hay theo hoá đơn · đề xuất: theo hoá đơn.
- D-06 · Ngưỡng giỏ trước hay sau giảm theo món · đề xuất: sau.
- D-07 · Khuyến mại khi offline · đề xuất: bộ đồng bộ gần nhất.
- D-08 · Phạm vi so sánh best deal · đề xuất: theo nhóm đơn vị tranh nhau (SA chốt).

## Ngoài phạm vi
- Coupon, override, tích / đổi điểm, trả hàng (dùng phần chia ở STK-R07), làm tròn tiền mặt khi thanh toán.
