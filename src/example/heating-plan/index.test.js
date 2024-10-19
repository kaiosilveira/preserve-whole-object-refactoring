import { HeatingPlan } from './index';

describe('HeatingPlan', () => {
  describe('withinRange', () => {
    const aPlan = new HeatingPlan({ low: 10, high: 20 });

    it('should return true if the plan is within range', () => {
      const result = aPlan.xxNEWWithinRange({ low: 15, high: 18 });
      expect(result).toBe(true);
    });

    it('should return false if the plan is not within range', () => {
      const result = aPlan.xxNEWWithinRange({ low: 5, high: 25 });
      expect(result).toBe(false);
    });
  });
});
