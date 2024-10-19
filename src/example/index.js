export function alertIfPlanIsNotWithinRange(aRoom, aPlan) {
  const alerts = [];

  if (!aPlan.withinRange(aRoom.daysTempRange)) {
    alerts.push('room temperature went outside range');
  }

  return alerts;
}
