# Demo 6 · Bug từ cửa hàng

Dán vào Claude Code:

/flow "bug: Khuyến mại 'Đồ uống mua 2 tặng 1'. Khách quét 2 lon Cola (20,00) rồi 1 hộp Sữa (45,00), máy tặng hộp Sữa (giảm 45,00). Spec PRM-R01 nói tặng món rẻ nhất, phải giảm 20,00. Nếu quét Sữa trước thì đúng."

Mong đợi: route bug → viết test tái hiện trong file test mới (test cũ đang đóng băng) → test đỏ → sửa src/pricing/engine.mjs → test xanh → review → dừng ở duyệt MR.
