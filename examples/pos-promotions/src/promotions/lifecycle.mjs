// PRM-R08, PRM-R09, PRM-R12: promotion lifecycle. Pure functions; each returns a new object.

const REQUIRED = ['name', 'type', 'value', 'start', 'end', 'scope']; // PRM-R12

/** PRM-R12: list the missing required fields (empty list = ok). */
export function validate(promo) {
  const missing = REQUIRED.filter((f) => {
    const v = promo[f];
    if (f === 'scope') return !v || !(v.skus?.length || v.categories?.length || v.brands?.length);
    if (f === 'value' && promo.type === 'bundle') return promo.bundlePrice == null;
    if (f === 'value' && promo.type === 'buyxgety') return !(promo.x > 0 && promo.y > 0);
    return v === undefined || v === null || v === '';
  });
  if (promo.start && promo.end && !(promo.end > promo.start)) missing.push('end (phải sau start)');
  return missing;
}

/** PRM-R08, PRM-R12: draft -> pending, only when every required field is there. */
export function submit(promo, user) {
  if (promo.status !== 'draft') throw new LifecycleError(`Chỉ gửi duyệt được bản nháp (đang: ${promo.status})`);
  const missing = validate(promo);
  if (missing.length) throw new LifecycleError(`Thiếu trường: ${missing.join(', ')}`, missing);
  return { ...promo, status: 'pending', submittedBy: user, createdBy: promo.createdBy ?? user };
}

/** PRM-R08: pending -> approved, by someone other than the creator (D-05). */
export function approve(promo, user, at) {
  if (promo.status !== 'pending') throw new LifecycleError(`Chỉ duyệt được khuyến mại Chờ duyệt (đang: ${promo.status})`);
  if (user === promo.createdBy) throw new LifecycleError('Người duyệt phải khác người tạo');
  return { ...promo, status: 'approved', approvedBy: user, approvedAt: at };
}

/** PRM-R08: pending -> draft, with a reason. */
export function reject(promo, user, reason) {
  if (promo.status !== 'pending') throw new LifecycleError(`Chỉ từ chối được khuyến mại Chờ duyệt (đang: ${promo.status})`);
  if (!reason) throw new LifecycleError('Từ chối phải có lý do');
  return { ...promo, status: 'draft', rejectedBy: user, rejectReason: reason };
}

/** PRM-R09: editing an approved promotion creates a new pending version; the old one keeps running. */
export function edit(promo, changes, user) {
  if (promo.status === 'draft') return { ...promo, ...changes };
  if (promo.status !== 'approved') throw new LifecycleError(`Không sửa được khuyến mại ${promo.status}`);
  const next = { ...promo, ...changes, version: promo.version + 1, status: 'pending', createdBy: user, approvedBy: undefined, approvedAt: undefined };
  return { current: promo, next };
}

/** PRM-R08: only approved promotions go to the terminals. */
export const forTerminals = (promos) => promos.filter((p) => p.status === 'approved');

export class LifecycleError extends Error {
  constructor(message, missing = []) { super(message); this.missing = missing; }
}
