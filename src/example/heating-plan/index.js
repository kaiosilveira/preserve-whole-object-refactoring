export class HeatingPlan {
  constructor(temperatureRange) {
    this._temperatureRange = temperatureRange;
  }

  withinRange(bottom, top) {
    return bottom >= this._temperatureRange.low && top <= this._temperatureRange.high;
  }

  xxNEWWithinRange(aNumberRange) {
    return (
      aNumberRange.low >= this._temperatureRange.low &&
      aNumberRange.high <= this._temperatureRange.high
    );
  }
}
