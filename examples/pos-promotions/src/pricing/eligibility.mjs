// PRM: is a promotion eligible for this sale, and which lines are in its scope.
// Times are local Asia/Bangkok strings 'YYYY-MM-DDTHH:mm:ss' and compare as strings.

/** PRM-R02, PRM-R03, PRM-R04, PRM-R08 */
export function isEligible(promo, { store, at, customerGroup }) {
  if (promo.status !== 'approved') return false; // PRM-R08: only approved promotions reach the terminal
  if (!(promo.start <= at && at < promo.end)) return false; // PRM-R02: [start, end)
  if (promo.stores?.length && !promo.stores.includes(store)) return false; // PRM-R03: empty list = every store
  if (promo.customerGroup && promo.customerGroup !== customerGroup) return false; // PRM-R04
  return true;
}

/** PRM-R05: in scope when sku, category or brand matches, and the sku is not excluded (exclusion wins). */
export function inScope(line, scope = {}) {
  if (scope.exclude?.includes(line.sku)) return false;
  return Boolean(scope.skus?.includes(line.sku) || scope.categories?.includes(line.category) || scope.brands?.includes(line.brand));
}
