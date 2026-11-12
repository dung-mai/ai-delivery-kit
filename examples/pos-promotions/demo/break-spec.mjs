// Demo 3: make the STK spec bad on purpose, then run spec-lint and check.
//   node demo/break-spec.mjs          break it (keeps a backup)
//   node demo/break-spec.mjs --undo   put the original back
import fs from 'node:fs';

const file = 'product/specs/promotion-apply/spec.md';
const backup = 'work/tasks/spec-backup.md';
if (process.argv.includes('--undo')) {
  if (!fs.existsSync(backup)) { console.log('Không có bản sao lưu: spec chưa bị làm hỏng.'); process.exit(0); }
  fs.copyFileSync(backup, file); fs.rmSync(backup);
  console.log(`Đã trả lại ${file}.`); process.exit(0);
}
let s = fs.readFileSync(file, 'utf8');
if (s.includes('STK-R16')) { console.log('Spec đã bị làm hỏng rồi. Hoàn tác: node demo/break-spec.mjs --undo'); process.exit(0); }
fs.mkdirSync('work/tasks', { recursive: true });
fs.copyFileSync(file, backup);
s = s.replace('Tính lại toàn bộ giỏ; màn hình thu ngân và màn hình khách hiện kết quả mới', 'Tính lại giỏ nhanh chóng và hiển thị phù hợp');
s = s.replace(/- \*\*STK-S02\*\* \[auto\] Given (.*?) When (.*?) Then (.*)$/m, '- **STK-S02** [auto] Sữa có −10% và −5%, mua 1 Sữa, giảm 6,53.');
s = s.replace('| STK-R14 | Máy POS mất kết nối |', '| STK-R16 | Giỏ có từ 10 món trở lên | Giảm thêm 2% | D-99 |\n| STK-R14 | Máy POS mất kết nối |');
fs.writeFileSync(file, s);
console.log(`Đã làm hỏng ${file}:
  1. STK-R10: thêm từ mơ hồ "nhanh chóng", "phù hợp"
  2. STK-S02: bỏ Given/When/Then
  3. STK-R16: luật mới có ngưỡng 10 món nhưng không có ví dụ nào, và trỏ tới thẻ D-99 không tồn tại
Giờ chạy:  node .flow/sensors/flow.mjs spec-lint   rồi   node .flow/sensors/flow.mjs check
Hoàn tác:  node demo/break-spec.mjs --undo`);
