function planBadgeLabel(subscriptionPlanId) {
  if (!subscriptionPlanId) return 'Starter';
  const s = String(subscriptionPlanId).toLowerCase();
  if (s.includes('gold')) return 'Gold';
  if (s.includes('silver')) return 'Silver';
  if (s.includes('bronze')) return 'Bronze';
  if (s.includes('starter')) return 'Starter';
  return 'Starter';
}

module.exports = { planBadgeLabel };
