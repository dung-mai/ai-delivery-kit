# Bối cảnh · Epic Khuyến mại (POS, khách Thái Lan)

## Mục tiêu
- Thu ngân áp dụng đúng mọi khuyến mại đang chạy mà không phải nhớ hay tính tay; khách thấy rõ mình được giảm gì trên màn hình và biên lai.
- Bộ phận marketing tạo, duyệt và đổi khuyến mại mà không cần IT.
- Đo thành công: 0 sai lệch tiền giữa POS và bảng ví dụ đã duyệt; mọi giao dịch ghi được khuyến mại và phiên bản đã áp dụng (đối soát, trả hàng).

## Nguồn
| Tài liệu | Nói về | Độ tin cậy |
|---|---|---|
| `product/source/pos-system-handover.md` §2 | "Rule engine: coupon, bundle, quy tắc theo thời gian, best-deal và override" | đề xuất (proposal 25/06/2026, chưa ký) |
| `product/source/pos-system-handover.md` §2, §8 | Cần làm rõ: thứ tự ưu tiên, cộng dồn, phiên bản giá, quyền override, offline; khách hàng có employee discount, loyalty | đề xuất |
| `product/source/pos-system-handover.md` §5 | Snapshot giá, thuế, khuyến mại tại thời điểm bán; tiền dùng số nguyên đơn vị nhỏ nhất | đề xuất của nhà thầu |
| `knowledge/law/th-vat-discount.md` | VAT 7% đến 30/09/2027; giảm giá tại thời điểm bán trừ khỏi giá tính thuế | luật, có nguồn |
| `knowledge/domain/promotions.md`, `knowledge/hard-cases/promo-stacking.md` | Loại khuyến mại, cộng dồn, phân bổ | tham khảo (Odoo, SAP) |

### Nguồn chưa nói
- Khách đang chạy những loại khuyến mại nào, bao nhiêu khuyến mại cùng lúc, ví dụ thật → xin 10 khuyến mại gần nhất (đã che số liệu). Chưa có thẻ: việc cần làm của PO.
- Cộng dồn và cách chọn khi nhiều khuyến mại cùng đủ điều kiện → D-01.
- Nhiều % cộng dồn tính nối tiếp hay trên giá gốc → D-02.
- Khuyến mại xét hiệu lực lúc quét món hay lúc bấm tổng → D-03.
- Làm tròn và VAT theo dòng hay theo hoá đơn → D-04.
- Ai được tạo / duyệt khuyến mại → D-05.
- Ngưỡng giỏ hàng tính trước hay sau giảm giá theo món → D-06.
- Khuyến mại khi máy POS mất kết nối → D-07.
- Coupon, override của thu ngân, loyalty: chưa có chi tiết → để năng lực sau (xem bản đồ).

## Vai trò
| Vai trò | Làm gì | Không được làm |
|---|---|---|
| Thu ngân | Quét hàng, nhận diện thành viên, xem khuyến mại được áp | Sửa, tắt hay chọn khuyến mại thay hệ thống |
| Quản lý cửa hàng | Xem khuyến mại đang chạy ở cửa hàng mình | Tạo, sửa khuyến mại |
| Marketing (trụ sở) | Tạo, sửa bản nháp, gửi duyệt | Duyệt khuyến mại do chính mình tạo |
| Người duyệt khuyến mại | Duyệt / từ chối | Duyệt khuyến mại do chính mình tạo |
| Khách hàng | Nhận giảm giá, xem trên màn hình khách và biên lai | |

## Trục biến thể
- Cửa hàng (14 chi nhánh) · nhóm khách (tất cả / thành viên / nhân viên) · thời gian (giờ Bangkok) · trạng thái máy (online / offline).
- Kênh: chỉ POS quầy trong epic này; mobile POS, SCO dùng chung luật sau.

## Điểm chạm
| Với | Chiều | Chủ sở hữu |
|---|---|---|
| Danh mục sản phẩm, giá gốc (ERP / PIM) | vào POS | khách (IT) |
| Thành viên (loyalty) | vào: nhóm khách | khách |
| Biên lai / ABB | ra: dòng giảm giá, tổng sau giảm | nhà thầu |
| Báo cáo, ERP | ra: giao dịch kèm mã khuyến mại và phiên bản | nhà thầu |

## Ràng buộc
- Tiền: THB, tính bằng satang nguyên (1 THB = 100 satang); không dùng số thực.
- Giờ: Asia/Bangkok.
- VAT là cấu hình có ngày hiệu lực (7% đến 30/09/2027).
- Không đưa dữ liệu thật của khách vào công cụ AI; ví dụ dùng sản phẩm và giá giả lập.

## Thuật ngữ
Xem `knowledge/glossary.md`.
