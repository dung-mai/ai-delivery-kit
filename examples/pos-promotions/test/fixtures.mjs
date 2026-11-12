// Test data from product/specs/*/examples.md. Prices in satang (VAT included).
export const PRODUCTS = {
  shampoo: { sku: 'SH01', name: 'Dầu gội', price: 15900, category: 'personal-care', brand: 'B1' },
  milk: { sku: 'MK01', name: 'Sữa', price: 4500, category: 'drinks', brand: 'B2' },
  cola: { sku: 'CL01', name: 'Cola', price: 2000, category: 'drinks', brand: 'B3' },
  snack: { sku: 'SN01', name: 'Snack', price: 3500, category: 'snacks', brand: 'B4' },
  rice: { sku: 'RC01', name: 'Gạo 5 kg', price: 18900, category: 'food', brand: 'B5' },
};
export const item = (p, qty = 1) => ({ ...p, qty });
export const custom = (sku, priceSatang, qty = 1) => ({ sku, name: sku, price: priceSatang, qty, category: 'misc', brand: 'X' });

const base = {
  status: 'approved', version: 1, start: '2026-12-01T00:00:00', end: '2027-01-01T00:00:00',
  stores: [], customerGroup: null, exclusive: false, priority: 50, approvedAt: '2026-11-20T09:00:00',
};
export const promo = (o) => ({ ...base, ...o });
const ALL = { categories: ['personal-care', 'drinks', 'snacks', 'food', 'misc'] };

// Promotions named in product/specs/promotion-apply/examples.md
export const P = {
  P1: promo({ id: 'P1', name: 'Dầu gội −10%', type: 'percent', value: 10, scope: { skus: ['SH01'] }, exclusive: true, priority: 1 }),
  P3: promo({ id: 'P3', name: 'Thành viên −5%', type: 'percent', value: 5, scope: ALL, customerGroup: 'member', priority: 3 }),
  P4: promo({ id: 'P4', name: 'Sữa −10%', type: 'percent', value: 10, scope: { skus: ['MK01'] }, priority: 1 }),
  P5: promo({ id: 'P5', name: 'Sữa −5%', type: 'percent', value: 5, scope: { skus: ['MK01'] }, priority: 2 }),
  P6: promo({ id: 'P6', name: 'Cola mua 2 tặng 1', type: 'buyxgety', x: 2, y: 1, scope: { skus: ['CL01'] }, exclusive: true, priority: 2 }),
  P7: promo({ id: 'P7', name: 'Cola −40%', type: 'percent', value: 40, scope: { skus: ['CL01'] }, exclusive: true, priority: 3 }),
  P8: promo({ id: 'P8', name: 'Cola giảm 20 mỗi 3 lon', type: 'amount', value: 2000, per: 3, scope: { skus: ['CL01'] }, exclusive: true, priority: 1 }),
  P9: promo({ id: 'P9', name: 'Giỏ từ 300 giảm 5%', type: 'basket', basketType: 'percent', value: 5, minAmount: 30000, scope: ALL, priority: 5 }),
  P10: promo({ id: 'P10', name: 'Giỏ từ 300 giảm 50', type: 'basket', basketType: 'amount', value: 5000, minAmount: 30000, scope: ALL, priority: 6 }),
};

export const promoSet = (promotions, o = {}) => ({ id: 'PS-1130', syncedAt: '2026-11-30T23:00:00', promotions, ...o });
export const basket = (lines, o = {}) => ({ store: 'S01', at: '2026-12-15T10:00:00', customerGroup: null, lines, ...o });
// 7% now; the 10% row only exists to test STK-EX-12 (rate change by date).
export const CONFIG = { vat: [{ from: '2026-10-01T00:00:00', rate: 7 }, { from: '2027-10-01T00:00:00', rate: 10 }] };

export const discountsOf = (result, promoId) => result.lines.flatMap((l) => l.discounts).filter((d) => d.promoId === promoId).reduce((a, d) => a + d.amount, 0);
export const lineDiscount = (result, index) => result.lines[index].discounts.reduce((a, d) => a + d.amount, 0);
