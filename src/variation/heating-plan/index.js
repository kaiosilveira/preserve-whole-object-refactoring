export class HeatingPlan {
  constructor(temperatureRange) {
    this._temperatureRange = temperatureRange;
  }

  xxNEWWithinRange(tempRange) {
    const low = tempRange.low;
    const high = tempRange.high;
    const isWithinRange = low >= this._temperatureRange.low && high <= this._temperatureRange.high;
    return isWithinRange;
  }
}
