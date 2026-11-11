# Checklist các cổng

Người duyệt trả lời: **duyệt** / **sửa** (ghi mã dòng cần sửa) / **dừng**. Đọc quá ~1 giờ nghĩa là việc quá to: đề nghị chia nhỏ.

## route (Dev / TL, chỉ epic và change)
- [ ] Đúng loại việc, đúng kích thước; cờ "chạm lõi" đúng
- [ ] Biết sẽ dừng ở những cổng nào, ai ký

## spec (nội bộ: PO + SA)
- [ ] Đọc bảng ví dụ trước: số đúng (tính lại vài dòng), đủ biên / âm / tổ hợp
- [ ] Luật khớp nguồn và `knowledge/`; chỗ nào tự đặt đều ghi `Giả định`
- [ ] `spec-lint`: 0 lỗi; cảnh báo còn lại đã xem
- [ ] Spec critic: không còn blocker
- [ ] Câu hỏi cho khách có phương án + đề xuất + mặc định
- [ ] Vai trò, màn hình, điểm chạm đủ để thiết kế bắt đầu

## scope (khách)
- [ ] Khách xác nhận bảng ví dụ và prototype, không phải tài liệu kỹ thuật
- [ ] Mọi câu hỏi "hỏi khách" đã trả lời hoặc chấp nhận mặc định

## design (SA + TL, chỉ khi chạm lõi)
- [ ] Mỗi ADR một quyết định, có 2 phương án bị loại và lý do
- [ ] Contract và mô hình dữ liệu khớp spec (mã luật)
- [ ] Rủi ro offline, thanh toán treo, tích hợp lỗi có cách xử lý

## ui (PO / khách)
- [ ] Chọn 1 trong 2–3 phương án; ghi lý do
- [ ] Màn hình chính chạy được trên thiết bị đích

## merge (1 người duyệt)
- [ ] Checks xanh, test đóng băng không bị sửa
- [ ] Đọc walkthrough, rồi diff ở chỗ nó chỉ; AI review đã xử lý
- [ ] Code tiền / thanh toán: người duyệt hiểu luật đó

## qa (QA lead) · uat (khách)
- [ ] Ma trận AC → test → bằng chứng không còn ô trống ngoài `[manual]` đã lên lịch
- [ ] Lỗi mở đều có mức độ và route
