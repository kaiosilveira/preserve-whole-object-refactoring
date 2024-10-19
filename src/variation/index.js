export function alertIfPlanIsNotWithinRange(aRoom, aPlan) {
  const alerts = [];

  const tempRange = aRoom.daysTempRange;
  const isWithinRange = aPlan.xxNEWWithinRange(tempRange);
  if (!isWithinRange) {
    alerts.push('room temperature went outside range');
  }

  return alerts;
}
