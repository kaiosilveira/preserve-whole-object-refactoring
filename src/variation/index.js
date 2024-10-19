export function alertIfPlanIsNotWithinRange(aRoom, aPlan) {
  const alerts = [];

  const low = aRoom.daysTempRange.low;
  const high = aRoom.daysTempRange.high;
  const isWithinRange = aPlan.withinRange(low, high);
  if (!isWithinRange) {
    alerts.push('room temperature went outside range');
  }

  return alerts;
}
