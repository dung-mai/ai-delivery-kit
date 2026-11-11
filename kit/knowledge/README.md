# knowledge/

Kho tri thức dùng chung cho mọi lane: những câu trả lời team cần lặp lại, có nguồn. Agent đọc ở đây trước khi viết spec, thiết kế, test (skill `knowledge`).

## Bố cục
| Thư mục | Chứa | Chủ sở hữu |
|---|---|---|
| `domain/` | nghiệp vụ: bán, khuyến mại, thanh toán, trả hàng, ca, tồn kho | BA |
| `law/` | luật và quy định của nước khách (thuế, hoá đơn, dữ liệu cá nhân) | BA + SA |
| `hard-cases/` | một file một cái bẫy: mô tả, ví dụ, cách hệ thống khác xử lý | SA |
| `integrations/` | một thẻ mỗi hệ thống ngoài: giao thức, dữ liệu, lỗi hay gặp | SA |
| `glossary.md` | thuật ngữ, kèm tiếng của khách | BA |

## Luật
- Mỗi file ≤ ~150 dòng, mỗi ý có nguồn (link + ngày kiểm) hoặc "khách trả lời D-xx (ngày)".
- Đầu file: `Chủ sở hữu:` và `Xem lại:` (ngày).
- Chỉ thêm khi một câu trả lời đã cần tới lần thứ hai, hoặc là luật mọi năng lực phụ thuộc. Người sở hữu xác nhận trước khi ghi.
- Không dữ liệu cá nhân, giao dịch thật, mật khẩu, hay chép nguyên văn tài liệu trả phí.
