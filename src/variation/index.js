export function alertIfPlanIsNotWithinRange(aRoom, aPlan) {
  const alerts = [];

  const tempRange = aRoom.daysTempRange;
  const isWithinRange = aPlan.withinRange(tempRange);
  if (!isWithinRange) {
    alerts.push('room temperature went outside range');
  }

  return alerts;
}
