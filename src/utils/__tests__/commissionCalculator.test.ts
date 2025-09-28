import { calculateCommissions, calculateCashback, calculateTreasuryRevenue } from '../commissionCalculator';

describe('Commission Calculator', () => {
  describe('calculateCommissions', () => {
    it('should calculate correct commissions for $10 fees', () => {
      const result = calculateCommissions(10);
      
      expect(result.level1).toBe(3.00); // 30% of $10
      expect(result.level2).toBe(0.30); // 3% of $10
      expect(result.level3).toBe(0.20); // 2% of $10
      expect(result.total).toBe(3.50);  // Total: 35% of $10
    });

    it('should calculate correct commissions for $100 fees', () => {
      const result = calculateCommissions(100);
      
      expect(result.level1).toBe(30.00); // 30% of $100
      expect(result.level2).toBe(3.00);  // 3% of $100
      expect(result.level3).toBe(2.00);  // 2% of $100
      expect(result.total).toBe(35.00);  // Total: 35% of $100
    });

    it('should handle decimal precision correctly', () => {
      const result = calculateCommissions(33.33);
      
      expect(result.level1).toBe(10.00); // 30% of $33.33 (rounded)
      expect(result.level2).toBe(1.00); // 3% of $33.33 (rounded)
      expect(result.level3).toBe(0.67); // 2% of $33.33 (rounded)
      expect(result.total).toBe(11.67); // Total rounded
    });
  });

  describe('calculateCashback', () => {
    it('should calculate 10% cashback correctly', () => {
      expect(calculateCashback(10)).toBe(1.00);
      expect(calculateCashback(100)).toBe(10.00);
      expect(calculateCashback(33.33)).toBe(3.33);
    });
  });

  describe('calculateTreasuryRevenue', () => {
    it('should calculate 55% treasury revenue correctly', () => {
      // $10 fees: 35% commissions + 10% cashback = 45%, so 55% treasury
      expect(calculateTreasuryRevenue(10)).toBe(5.50);
      expect(calculateTreasuryRevenue(100)).toBe(55.00);
    });

    it('should ensure total distribution equals 100%', () => {
      const fees = 100;
      const commissions = calculateCommissions(fees);
      const cashback = calculateCashback(fees);
      const treasury = calculateTreasuryRevenue(fees);
      
      const total = commissions.total + cashback + treasury;
      expect(total).toBe(fees); // Should equal original fees
    });
  });
});
