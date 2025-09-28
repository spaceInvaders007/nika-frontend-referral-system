/**
 * Commission calculation utilities
 * Implements the 3-level cascade system: 30%, 3%, 2%
 */

export interface TradeData {
  userId: string;
  volume: number;
  fees: number;
}

export interface CommissionResult {
  level1: number; // 30% of fees
  level2: number; // 3% of fees  
  level3: number; // 2% of fees
  total: number;  // Total commissions
}

/**
 * Calculate commissions for a 3-level referral cascade
 * @param fees - Trading fees paid
 * @returns Commission breakdown by level
 */
export function calculateCommissions(fees: number): CommissionResult {
  const level1 = fees * 0.30; // 30% for direct referral
  const level2 = fees * 0.03; // 3% for referral's referral
  const level3 = fees * 0.02; // 2% for third level
  const total = level1 + level2 + level3;

  return {
    level1: Math.round(level1 * 100) / 100, // Round to 2 decimal places
    level2: Math.round(level2 * 100) / 100,
    level3: Math.round(level3 * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

/**
 * Calculate cashback for referred users
 * @param fees - Trading fees paid
 * @returns Cashback amount (10% of fees)
 */
export function calculateCashback(fees: number): number {
  const cashback = fees * 0.10; // 10% cashback
  return Math.round(cashback * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate treasury revenue after commissions and cashback
 * @param fees - Trading fees paid
 * @returns Treasury revenue (55% of fees)
 */
export function calculateTreasuryRevenue(fees: number): number {
  const commissions = calculateCommissions(fees);
  const cashback = calculateCashback(fees);
  const treasury = fees - commissions.total - cashback;
  return Math.round(treasury * 100) / 100;
}
