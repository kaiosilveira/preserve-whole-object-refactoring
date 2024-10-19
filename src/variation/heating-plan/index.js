export class HeatingPlan {
  constructor(temperatureRange) {
    this._temperatureRange = temperatureRange;
  }

  withinRange(bottom, top) {
    return bottom >= this._temperatureRange.low && top <= this._temperatureRange.high;
  }

  xxNEWWithinRange(tempRange) {
    const low = tempRange.low;
    const high = tempRange.high;
    const isWithinRange = this.withinRange(low, high);
    return isWithinRange;
  }
}
