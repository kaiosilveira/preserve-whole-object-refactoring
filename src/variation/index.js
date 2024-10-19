export function alertIfPlanIsNotWithinRange(aRoom, aPlan) {
  const alerts = [];

  const tempRange = aRoom.daysTempRange;
  const isWithinRange = xxNEWWithinRange(aPlan, tempRange);
  if (!isWithinRange) {
    alerts.push('room temperature went outside range');
  }

  return alerts;
}

function xxNEWWithinRange(aPlan, tempRange) {
  const low = tempRange.low;
  const high = tempRange.high;
  const isWithinRange = aPlan.withinRange(low, high);
  return isWithinRange;
}
