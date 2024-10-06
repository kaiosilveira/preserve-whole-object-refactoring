import { alertIfPlanIsNotWithinRange } from './index';
import { HeatingPlan } from './heating-plan';

describe('alertIfPlanIsNotWithinRange', () => {
  const tenToTwentyDegPlan = new HeatingPlan({ low: 10, high: 20 });

  it('should return no alerts if the plan is within range', () => {
    const aRoom = { daysTempRange: { low: 10, high: 20 } };
    const alerts = alertIfPlanIsNotWithinRange(aRoom, tenToTwentyDegPlan);
    expect(alerts).toEqual([]);
  });

  it('should return one alert if the room temperature went above the planned range', () => {
    const aRoom = { daysTempRange: { low: 10, high: 25 } };
    const alerts = alertIfPlanIsNotWithinRange(aRoom, tenToTwentyDegPlan);

    expect(alerts).toEqual(['room temperature went outside range']);
  });

  it('should return one alert if the room temperature went below the planned range', () => {
    const aRoom = { daysTempRange: { low: 8, high: 18 } };
    const alerts = alertIfPlanIsNotWithinRange(aRoom, tenToTwentyDegPlan);
    expect(alerts).toEqual(['room temperature went outside range']);
  });
});
