import { calculateCommissions, calculateCashback, calculateTreasuryRevenue } from '../utils/commissionCalculator';

// Mock the API service to avoid axios import issues
jest.mock('../services/api', () => ({
  login: jest.fn(),
  signup: jest.fn(),
  generateReferralCode: jest.fn(),
}));

describe('Referral Flow Integration Tests', () => {
  describe('Commission Distribution Integration', () => {
    it('should correctly distribute $100 in trading fees', () => {
      const fees = 100;
      
      // Calculate all components
      const commissions = calculateCommissions(fees);
      const cashback = calculateCashback(fees);
      const treasury = calculateTreasuryRevenue(fees);
      
      // Verify individual components
      expect(commissions.level1).toBe(30.00); // 30% direct referral
      expect(commissions.level2).toBe(3.00);  // 3% second level
      expect(commissions.level3).toBe(2.00);  // 2% third level
      expect(commissions.total).toBe(35.00);  // Total commissions
      expect(cashback).toBe(10.00);           // 10% cashback
      expect(treasury).toBe(55.00);           // 55% treasury
      
      // Verify total distribution equals original fees
      const totalDistributed = commissions.total + cashback + treasury;
      expect(totalDistributed).toBe(fees);
    });

    it('should handle edge case of $0 fees', () => {
      const fees = 0;
      
      const commissions = calculateCommissions(fees);
      const cashback = calculateCashback(fees);
      const treasury = calculateTreasuryRevenue(fees);
      
      expect(commissions.total).toBe(0);
      expect(cashback).toBe(0);
      expect(treasury).toBe(0);
    });

    it('should maintain precision for small amounts', () => {
      const fees = 0.01; // 1 cent
      
      const commissions = calculateCommissions(fees);
      const cashback = calculateCashback(fees);
      const treasury = calculateTreasuryRevenue(fees);
      
      // All amounts should be properly rounded
      expect(commissions.total).toBe(0.00); // Rounded down
      expect(cashback).toBe(0.00);          // Rounded down
      expect(treasury).toBe(0.01);          // Remaining goes to treasury
    });
  });
});
