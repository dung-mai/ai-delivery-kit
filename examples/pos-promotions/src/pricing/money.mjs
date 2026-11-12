// Money is always an integer number of satang (1 THB = 100 satang). Never floats.

/** a * b / c rounded half up, for non-negative integers (STK-R08). */
export function mulDivRound(a, b, c) {
  if (c === 0) return 0;
  return Math.floor((2 * a * b + c) / (2 * c));
}

/**
 * Split `total` over `weights` in proportion, each share rounded half up (STK-R07, STK-R08).
 * The rounding remainder goes to the largest weight; on a tie, the earliest one.
 */
export function allocate(total, weights) {
  const sum = weights.reduce((a, w) => a + w, 0);
  if (sum === 0 || total === 0) return weights.map(() => 0);
  const shares = weights.map((w) => mulDivRound(total, w, sum));
  const diff = total - shares.reduce((a, s) => a + s, 0);
  if (diff !== 0) {
    let k = 0;
    weights.forEach((w, i) => { if (w > weights[k]) k = i; });
    shares[k] += diff;
  }
  return shares;
}

/** 29744 -> "297.44", 123456 -> "1,234.56" (receipt format). */
export function formatTHB(satang) {
  const sign = satang < 0 ? '-' : '';
  const v = Math.abs(satang);
  const baht = Math.floor(v / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${sign}${baht}.${String(v % 100).padStart(2, '0')}`;
}
