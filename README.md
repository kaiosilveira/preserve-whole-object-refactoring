[![Continuous Integration](https://github.com/kaiosilveira/preserve-whole-object-refactoring/actions/workflows/ci.yml/badge.svg)](https://github.com/kaiosilveira/preserve-whole-object-refactoring/actions/workflows/ci.yml)

ℹ️ _This repository is part of my Refactoring catalog based on Fowler's book with the same title. Please see [kaiosilveira/refactoring](https://github.com/kaiosilveira/refactoring) for more details._

---

# Preserve Whole Object

<table>
<thead>
<th>Before</th>
<th>After</th>
</thead>
<tbody>
<tr>
<td>

```javascript
const low = aRoom.daysTempRange.low;
const high = aRoom.daysTempRange.high;
if (aPlan.withinRange(low, high))
```

</td>

<td>

```javascript
if (aPlan.withinRange(aRoom.daysTempRange))
```

</td>
</tr>
</tbody>
</table>

Functions evolve and, sometimes, their parameter lists evolve with them. More often than not, we find ourselves providing a long list of arguments to a function, with each of these arguments belonging to the same top-level object. This refactoring helps with strategies to preserve the whole object in these cases, consequentially reducing the argument list.

## Working example

Our working example consists of a system that alerts when a room goes outside of the planned temperature range. We have a `HeatingPlan` that knows whether or not a threshold is within its predefined range:

```javascript
export class HeatingPlan {
  constructor(temperatureRange) {
    this._temperatureRange = temperatureRange;
  }
  withinRange(bottom, top) {
    return bottom >= this._temperatureRange.low && top <= this._temperatureRange.high;
  }
}
```

and we have a function that uses the `HeatingPlan` construct to create alerts for outliers:

```javascript
export function alertIfPlanIsNotWithinRange(aRoom, aPlan) {
  const alerts = [];
  const low = aRoom.daysTempRange.low;
  const high = aRoom.daysTempRange.high;
  if (!aPlan.withinRange(low, high)) {
    alerts.push('room temperature went outside range');
  }
  return alerts;
}
```

Our goal here is to preserve the whole `daysTempRange` object when calling `withinRange`, therefore reducing the argument list for this function, but also reducing the number of temp variables involved in the calculations.

### Test suite

The test suite for the `HeatingPlan` covers the cases of being inside and outside of the target range:

```javascript
describe('HeatingPlan', () => {
  describe('withinRange', () => {
    const aPlan = new HeatingPlan({ low: 10, high: 20 });

    it('should return true if the plan is within range', () => {
      const result = aPlan.withinRange({ low: 15, high: 18 });
      expect(result).toBe(true);
    });

    it('should return false if the plan is not within range', () => {
      const result = aPlan.withinRange({ low: 5, high: 25 });
      expect(result).toBe(false);
    });
  });
});
```

Whereas the test suite for the alerting function covers the cases where the room is inside the planned range, but also where the room is either outside the lower or the higher end of the range:

```javascript
describe('alertIfPlanIsNotWithinRange', () => {
  const tenToTwentyDegPlan = new HeatingPlan({ low: 10, high: 20 });

  it('should return no alerts if the plan is within range', () => {
    const aRoom = { daysTempRange: { low: 10, high: 20 } };
    const alerts = alertIfPlanIsNotWithinRange(aRoom, tenToTwentyDegPlan);
    expect(alerts).toEqual([]);
  });

  it('should return one alert if the room temperature went above the planned range', () => {
    const aRoom = { daysTempRange: { low: 10, high: 25 } };
    const alerts = alertIfPlanIsNotWithinRange(aRoom, tenToTwentyDegPlan);

    expect(alerts).toEqual(['room temperature went outside range']);
  });

  it('should return one alert if the room temperature went below the planned range', () => {
    const aRoom = { daysTempRange: { low: 8, high: 18 } };
    const alerts = alertIfPlanIsNotWithinRange(aRoom, tenToTwentyDegPlan);
    expect(alerts).toEqual(['room temperature went outside range']);
  });
});
```

With that in place, we can safely proceed.

### Base example

Our base example starts the work inside `HeatingPlan` itself. The idea is to change the signature of the `withinRange` function, so it receives the whole range object.

#### Steps

We start by introducing the envisioned signature for `withinRange`, with an easily recognizeable prefix:

```diff
diff --git HeatingPlan...
+  xxNEWWithinRange(aNumberRange) {
+    return this.withinRange(aNumberRange.low, aNumberRange.high);
+  }
```

Then, we update `alertIfPlanIsNotWithinRange` to use the new `withinRange` signature:

```diff
diff --git caller...
-  if (!aPlan.withinRange(low, high)) {
+  if (!aPlan.xxNEWWithinRange(aRoom.daysTempRange)) {
```

Since `low` and `high` are now unused, we **[remove this dead code](https://github.com/kaiosilveira/remove-dead-code-refactoring)**:

```diff
diff --git caller...
 export function alertIfPlanIsNotWithinRange(aRoom, aPlan) {
   const alerts = [];
-  const low = aRoom.daysTempRange.low;
-  const high = aRoom.daysTempRange.high;
   if (!aPlan.xxNEWWithinRange(aRoom.daysTempRange)) {
     alerts.push('room temperature went outside range');
   }
```

Now that the callers are updated, we can safely inline `withinRange` at `xxNEWWithinRange`:

```diff
diff --git HeatingPlan...
   xxNEWWithinRange(aNumberRange) {
-    return this.withinRange(aNumberRange.low, aNumberRange.high);
+    return (
+      aNumberRange.low >= this._temperatureRange.low &&
+      aNumberRange.high <= this._temperatureRange.high
+    );
   }
```

and update the tests to use only `xxNEWWithinRange`:

```diff
diff --git HeatingPlan tests...
describe('HeatingPlan', () => {
     const aPlan = new HeatingPlan({ low: 10, high: 20 });
     it('should return true if the plan is within range', () => {
-      const result = aPlan.withinRange(15, 18);
+      const result = aPlan.xxNEWWithinRange({ low: 15, high: 18 });
       expect(result).toBe(true);
     });
     it('should return false if the plan is not within range', () => {
-      const result = aPlan.withinRange(5, 25);
+      const result = aPlan.xxNEWWithinRange({ low: 5, high: 25 });
       expect(result).toBe(false);
     });
   });
```

Finally, we can remove the now unused unused `withinRange`:

```diff
diff --git HeatingPlan...
-  withinRange(bottom, top) {
-    return bottom >= this._temperatureRange.low && top <= this._temperatureRange.high;
-  }
-
```

Last, but not least, we rename `xxNEWWithinRange` to `withinRange`:

```diff
diff --git heating plan...
export class HeatingPlan {
     this._temperatureRange = temperatureRange;
   }
-  xxNEWWithinRange(aNumberRange) {
+  withinRange(aNumberRange) {
     return (
       aNumberRange.low >= this._temperatureRange.low &&
       aNumberRange.high <= this._temperatureRange.high

diff --git caller...
 export function alertIfPlanIsNotWithinRange(aRoom, aPlan) {
   const alerts = [];
-  if (!aPlan.xxNEWWithinRange(aRoom.daysTempRange)) {
+  if (!aPlan.withinRange(aRoom.daysTempRange)) {
     alerts.push('room temperature went outside range');
   }
```

And that's it!

#### Commit history

Below there's the commit history for the steps detailed above.

| Commit SHA                                                                                                                   | Message                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [e996b70](https://github.com/kaiosilveira/preserve-whole-object-refactoring/commit/e996b70e93d58070420624b32eedbe14bb338055) | introduce envisioned signature for `withinRange`                        |
| [dcba424](https://github.com/kaiosilveira/preserve-whole-object-refactoring/commit/dcba424f66a336183546b2f5747ca148a22de826) | update `alertIfPlanIsNotWithinRange` to use new `withinRange` signature |
| [43afcc4](https://github.com/kaiosilveira/preserve-whole-object-refactoring/commit/43afcc48a036d1d607b5a1685acf723795e84604) | remove unused temp vars                                                 |
| [c20a2f6](https://github.com/kaiosilveira/preserve-whole-object-refactoring/commit/c20a2f62b8bedb049c1d4cc3312aa68ef22801e4) | inline `withinRange` at `xxNEWWithinRange`                              |
| [463fa1d](https://github.com/kaiosilveira/preserve-whole-object-refactoring/commit/463fa1d0120d199ec3f578f65aade6402cb9ee3e) | update tests to use only `xxNEWWithinRange`                             |
| [c296105](https://github.com/kaiosilveira/preserve-whole-object-refactoring/commit/c29610581ad612f17b6dfec5b53f142ad8ff3f70) | remove unused `withinRange`                                             |
| [48ce585](https://github.com/kaiosilveira/preserve-whole-object-refactoring/commit/48ce585d42e2f1a1e150ea206e2908a4b061de8f) | rename `xxNEWWithinRange` to `withinRange`                              |

For the full commit history for this project, check the [Commit History tab](https://github.com/kaiosilveira/preserve-whole-object-refactoring/commits/main).

### Variation

A variation of the approach described above it to perform the changes from the calling code: the idea is to encapsulate the variables and the call to the original function into a new function, and then move this resulting function to the target class. The details are described below.

#### Steps

We start by **[extracting](https://github.com/kaiosilveira/extract-variable-refactoring)** the `isWithinRange` variable:

```diff
diff --git caller...
export function alertIfPlanIsNotWithinRange(aRoom, aPlan) {
-  if (!aPlan.withinRange(low, high)) {
+  const isWithinRange = aPlan.withinRange(low, high);
+  if (!isWithinRange) {
```

And then introduce a temp `tempRange` variable:

```diff
diff --git caller (alertIfPlanIsNotWithinRange)...
-  const low = aRoom.daysTempRange.low;
-  const high = aRoom.daysTempRange.high;
+  const tempRange = aRoom.daysTempRange;
+  const low = tempRange.low;
+  const high = tempRange.high;
```

We now can **[extract](https://github.com/kaiosilveira/extract-function-refactoring)** our `xxNEWWithinRange` function:

```diff
diff --git caller (top level)...
+
+function xxNEWWithinRange(aPlan, tempRange) {
+  const low = tempRange.low;
+  const high = tempRange.high;
+  const isWithinRange = aPlan.withinRange(low, high);
+  return isWithinRange;
+}
```

and start using it:

```diff
diff --git caller (alertIfPlanIsNotWithinRange)...
-  const low = tempRange.low;
-  const high = tempRange.high;
-  const isWithinRange = aPlan.withinRange(low, high);
+  const isWithinRange = xxNEWWithinRange(aPlan, tempRange);
```

With all that done, we can now move `xxNEWWithinRange` to `HeatingPlan` (with a slightly implementation update) and update the caller:

```diff
diff --git HeatingPlan...
+  xxNEWWithinRange(tempRange) {
+    const low = tempRange.low;
+    const high = tempRange.high;
+    const isWithinRange = this.withinRange(low, high);
+    return isWithinRange;
+  }
 }

diff --git caller...
export function alertIfPlanIsNotWithinRange(aRoom, aPlan) {
   const alerts = [];
   const tempRange = aRoom.daysTempRange;
-  const isWithinRange = xxNEWWithinRange(aPlan, tempRange);
+  const isWithinRange = aPlan.xxNEWWithinRange(tempRange);
   if (!isWithinRange) {
     alerts.push('room temperature went outside range');
   }
   return alerts;
 }
-
-function xxNEWWithinRange(aPlan, tempRange) {
-  const low = tempRange.low;
-  const high = tempRange.high;
-  const isWithinRange = aPlan.withinRange(low, high);
-  return isWithinRange;
-}
```

Then, we can proceed with inlining `withinRange` into `xxNEWWithinRange`:

```diff
diff --git HeatingPlan...
-  withinRange(bottom, top) {
-    return bottom >= this._temperatureRange.low && top <= this._temperatureRange.high;
-  }
-
   xxNEWWithinRange(tempRange) {
     const low = tempRange.low;
     const high = tempRange.high;
-    const isWithinRange = this.withinRange(low, high);
+    const isWithinRange = low >= this._temperatureRange.low && high <= this._temperatureRange.high;
     return isWithinRange;
   }
 }
```

And, finally, we can rename `xxNEWWithinRange` to `withinRange`:

```diff
diff --git HeatingPlan...
-  xxNEWWithinRange(tempRange) {
+  withinRange(tempRange) {

diff --git caller (alertIfPlanIsNotWithinRange)...
-  const isWithinRange = aPlan.xxNEWWithinRange(tempRange);
+  const isWithinRange = aPlan.withinRange(tempRange);
```

And that's it!

#### Commit history

Below there's the commit history for the steps detailed above.

| Commit SHA                                                                                                                   | Message                                                            |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [7a33df9](https://github.com/kaiosilveira/preserve-whole-object-refactoring/commit/7a33df9f393f91af83ee3e5480b93b74ca68bda9) | extract `isWithinRange` variable                                   |
| [98e712d](https://github.com/kaiosilveira/preserve-whole-object-refactoring/commit/98e712dc469e3eda1cf9ed41e239d7f9708d3ce7) | introduce `tempRange` temp var                                     |
| [b90ce8a](https://github.com/kaiosilveira/preserve-whole-object-refactoring/commit/b90ce8a2131d15cc5650c896c23f0f6575b58eb8) | introduce `xxNEWWithinRange`                                       |
| [27c1a3d](https://github.com/kaiosilveira/preserve-whole-object-refactoring/commit/27c1a3df307e6b55aa74d7c0cf101d1e0273e544) | use `xxNEWWithinRange`                                             |
| [dff2127](https://github.com/kaiosilveira/preserve-whole-object-refactoring/commit/dff2127ecc39a66d9412209565db7388780e585f) | move `xxNEWWithinRange` to `HeatingPlan`                           |
| [903047b](https://github.com/kaiosilveira/preserve-whole-object-refactoring/commit/903047b5dcf7c712972405c2c991e634db5435f6) | inline `withinRange` into `xxNEWWithinRange`                       |
| [9b0583a](https://github.com/kaiosilveira/preserve-whole-object-refactoring/commit/9b0583a4f12db76466642db28a663ee3dceaaafb) | rename `HeatingPlan.xxNEWWithinRange` to `HeatingPlan.withinRange` |

For the full commit history for this project, check the [Commit History tab](https://github.com/kaiosilveira/preserve-whole-object-refactoring/commits/main).
