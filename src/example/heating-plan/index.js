export class HeatingPlan {
  withinRange(bottom, top) {
    return bottom >= this._temperatureRange.low && top <= this._temperatureRange.high;
  }
}
