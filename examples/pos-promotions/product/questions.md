# Câu hỏi cho khách

> Tự sinh bởi `flow.mjs questions` lúc 14:15:18 11/11/2026 từ các thẻ quyết định loại "ask client". Không sửa tay: sửa thẻ D-xx.

6 câu, 0 câu đang chặn việc. Mỗi câu có phương án và đề xuất của chúng tôi; khách chỉ cần chọn hoặc sửa. Khi chưa trả lời, đội làm tiếp theo cột "Đang dùng tạm".

## 1. Khi nhiều khuyến mại cùng đủ điều kiện, cái nào được dùng cùng nhau và chọn thế nào?

- Thẻ: `product/decisions/D-01-cong-don.md` · Ảnh hưởng: STK-R02, STK-R03, STK-R05
- A. Mỗi khuyến mại là độc quyền hoặc cộng dồn; hệ thống chọn phương án giảm nhiều nhất cho khách; hoà thì theo độ ưu tiên
- B. Chỉ theo độ ưu tiên marketing đặt, không so sánh lợi ích
- C. Nhóm loại trừ tuỳ ý (mỗi khuyến mại thuộc 1 nhóm, mỗi nhóm tối đa 1)
- **Đề xuất:** A, vì trùng với "best-deal" trong proposal và đơn giản để marketing dùng. Đổi sau thì tốn: viết lại STK-R03..R05 và khoảng 8 ví dụ. Độ tin cậy: trung bình.
- **Đang dùng tạm:** phương án A

## 2. Hai khuyến mại % cộng dồn trên cùng món: tính nối tiếp hay trên giá gốc?

- Thẻ: `product/decisions/D-02-phan-tram-noi-tiep.md` · Ảnh hưởng: STK-R04
- A. Nối tiếp, theo độ ưu tiên
- B. Cộng % trên giá gốc
- **Đề xuất:** A. Đổi sau thì tốn: 1 luật, 3 ví dụ. Độ tin cậy: trung bình.
- **Đang dùng tạm:** phương án A

## 3. Khuyến mại xét hiệu lực lúc quét món hay lúc bấm tổng?

- Thẻ: `product/decisions/D-03-thoi-diem-xet.md` · Ảnh hưởng: STK-R12, PRM-R02
- A. Lúc bấm tổng; mọi khuyến mại được tính lại tại thời điểm đó
- B. Lúc quét từng món
- **Đề xuất:** A. Đổi sau thì tốn: 1 luật, 2 ví dụ, phần ghi phiên bản. Độ tin cậy: trung bình.
- **Đang dùng tạm:** phương án A

## 4. Làm tròn giảm giá và VAT: theo dòng hay theo hoá đơn?

- Thẻ: `product/decisions/D-04-lam-tron-vat.md` · Ảnh hưởng: STK-R07, STK-R08, STK-R11
- A. Mỗi khoản giảm làm tròn nửa lên đến 1 satang; VAT tính một lần trên tổng hoá đơn sau giảm
- B. VAT tính và làm tròn trên từng dòng rồi cộng lại
- **Đề xuất:** A, trừ khi hệ thống kế toán của khách đang dùng B. Độ tin cậy: thấp → cần kế toán của khách xác nhận.
- **Đang dùng tạm:** phương án A

## 5. Khuyến mại có cần người thứ hai duyệt trước khi chạy?

- Thẻ: `product/decisions/D-05-duyet-4-mat.md` · Ảnh hưởng: PRM-R08
- A. Bắt buộc người duyệt khác người tạo
- B. Người có quyền marketing tự chạy
- **Đề xuất:** A. Độ tin cậy: cao (thực hành phổ biến), vẫn cần khách xác nhận vai trò.
- **Đang dùng tạm:** phương án A

## 6. Ngưỡng giỏ hàng (ví dụ "mua từ 300 THB") tính trên tiền trước hay sau giảm giá theo món?

- Thẻ: `product/decisions/D-06-nguong-gio-hang.md` · Ảnh hưởng: STK-R06
- A. Sau giảm giá theo món (số khách thực trả)
- B. Trước giảm giá
- **Đề xuất:** A. Độ tin cậy: trung bình.
- **Đang dùng tạm:** phương án A
