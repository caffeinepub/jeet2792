const PAYOUT_MULTIPLIER = 1.98;
const PROFIT_MULTIPLIER = 0.98;

export function calculateWinProfit(invest: number): number {
  return invest * PROFIT_MULTIPLIER;
}

export function calculateWinReturn(invest: number): number {
  return invest * PAYOUT_MULTIPLIER;
}

export function calculateTargetRemaining(target: number, totalProfit: number): number {
  return Math.max(target - totalProfit, 0);
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}
