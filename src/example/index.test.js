import { jest } from '@jest/globals';
import { alertIfPlanIsNotWithinRange } from './index';

describe('alertIfPlanIsNotWithinRange', () => {
  it('should return no alerts if the plan is within range', () => {
    const aRoom = { daysTempRange: { low: 10, high: 20 } };
    const aPlan = { withinRange: jest.fn(() => true) };

    const alerts = alertIfPlanIsNotWithinRange(aRoom, aPlan);

    expect(alerts).toEqual([]);
  });

  it('should return one alert if the room temperature went outside range', () => {
    const aRoom = { daysTempRange: { low: 10, high: 20 } };
    const aPlan = { withinRange: jest.fn(() => false) };

    const alerts = alertIfPlanIsNotWithinRange(aRoom, aPlan);

    expect(alerts).toEqual(['room temperature went outside range']);
  });
});
