export function alertIfPlanIsNotWithinRange(aRoom, aPlan) {
  const alerts = [];

  const tempRange = aRoom.daysTempRange;
  const low = tempRange.low;
  const high = tempRange.high;
  const isWithinRange = aPlan.withinRange(low, high);
  if (!isWithinRange) {
    alerts.push('room temperature went outside range');
  }

  return alerts;
}
