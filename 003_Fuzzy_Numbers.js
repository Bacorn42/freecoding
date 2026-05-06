// Alright, stupid idea time
// What if numbers had uncertainty?

class FuzzyNumber {
  constructor(baseValue) {
    this.baseValue = baseValue;
  }

  plus(other) {
    return new FuzzyNumber(this.baseValue + this._getValue(other));
  }

  minus(other) {
    return new FuzzyNumber(this.baseValue - this._getValue(other));
  }

  times(other) {
    return new FuzzyNumber(this.baseValue * this._getValue(other));
  }

  divide(other) {
    return new FuzzyNumber(this.baseValue / this._getValue(other));
  }

  get() {
    const offsetCoefficient = (Math.random() - 0.5) / 50; // 1%
    return this.baseValue * (1 + offsetCoefficient);
  }

  _getValue(other) {
    return other instanceof FuzzyNumber ? other.get() : Number(other);
  }
}

// Should be 200 but it's actually in the range 196.02 - 204.02
console.log(new FuzzyNumber(10).plus(new FuzzyNumber(10)).times(new FuzzyNumber(10)).get());

// Let's compound the error!
let startNum = new FuzzyNumber(0);
for (let i = 0; i < 100; i++) {
  startNum = startNum.plus(new FuzzyNumber(1));
}
console.log(startNum.get()); // Hmmm... this actually seems to be 99 - 101. Makes sense...

// So, how do I compound the error? Perhaps multiplication?
let multNum = new FuzzyNumber(1);
for (let i = 0; i < 100; i++) {
  multNum = multNum.times(new FuzzyNumber(1));
}
console.log(multNum.get()); // Ok, yes this is wilder!

// Let's check the statistics.
const sample = [];
for (let i = 0; i < 100; i++) {
  let mNum = new FuzzyNumber(1);
  for (let j = 0; j < 100; j++) {
    mNum = mNum.times(new FuzzyNumber(1));
  }
  sample.push(mNum.get());
}

const sum = sample.reduce((acc, cur) => acc + cur, 0);
const mean = sum / 100;

const differenceSquareSum = sample.reduce((acc, cur) => acc + (cur - mean) ** 2, 0);
const variance = differenceSquareSum / 100;
const stdDev = Math.sqrt(variance);

console.log("Mean: " + mean);
console.log("StdD: " + stdDev);
// Ok, seems mean is 1 and stdDev is about... 0.055 or so?

// Actually, let's generalize it

function getStats(startNum, func, samples, iters) {
  const sample = [];
  for (let i = 0; i < samples; i++) {
    let mNum = new FuzzyNumber(startNum);
    for (let j = 0; j < iters; j++) {
      mNum = func(mNum);
    }
    sample.push(mNum.get());
  }

  const sum = sample.reduce((acc, cur) => acc + cur, 0);
  const mean = sum / samples;

  const differenceSquareSum = sample.reduce((acc, cur) => acc + (cur - mean) ** 2, 0);
  const variance = differenceSquareSum / samples;
  const stdDev = Math.sqrt(variance);

  return {
    mean,
    stdDev,
  };
}

console.log(getStats(1, (n) => n.times(new FuzzyNumber(1)), 100, 100));
console.log(getStats(1, (n) => n.times(new FuzzyNumber(1)), 100, 1000)); // Yup, about the same

console.log(getStats(1, (n) => n.divide(new FuzzyNumber(1)), 1000, 100)); // Also about the same, as expected
console.log(getStats(1, (n) => n.times(new FuzzyNumber(1)).divide(new FuzzyNumber(1)), 1000, 100)); // Now we're cooking!

console.log(getStats(1, (n) => n.times(new FuzzyNumber(1)), 1000, 1000));
console.log(getStats(1, (n) => n.times(new FuzzyNumber(1)), 1000, 10000)); // Std dev up to about 0.6

// Let's calculate an integral
function integrate(f, a, b, s) {
  let sum = 0;
  for (; a < b; a += s) {
    sum += f(a) * s;
  }
  return sum;
}

const f = (x) => x ** 2 - x + 1;
console.log(integrate(f, 0, 2, 0.01)); // Should be x^3/3 - x^2/2 + x so 8/3 - 4/2 + 2 = 2.666666666666666
// It's 2.6567... close enough

// Now the funny kind
function fuzzyIntegrate(f, a, b, s) {
  let sum = new FuzzyNumber(0);
  for (; a < b; a += s) {
    sum = new FuzzyNumber(sum.plus(new FuzzyNumber(f(a)).times(new FuzzyNumber(s))).get());
  }
  return sum.get();
}

console.log(fuzzyIntegrate(f, 0, 2, 0.01)); // Not too far off, actually
// Let's see stats

console.log(getStats(0, (n) => new FuzzyNumber(fuzzyIntegrate(f, 0, 2, 0.01)), 1000, 1)); // Well, std dev is about 0.102
console.log(getStats(0, (n) => new FuzzyNumber(fuzzyIntegrate(f, 0, 2, 0.001)), 1000, 1)); // Now 0.32
console.log(getStats(0, (n) => new FuzzyNumber(fuzzyIntegrate(f, 0, 2, 0.0001)), 1000, 1)); // 1.05 or so lmao
console.log(getStats(0, (n) => new FuzzyNumber(fuzzyIntegrate(f, 0, 2, 0.0001)), 10000, 1)); // Takes forever but I got { mean: 2.697552125481298, stdDev: 1.1019168401201929 }

let wacky2 = new FuzzyNumber(2);
for (let i = 0; i < 10000; i++) {
  wacky2 = wacky2.times(new FuzzyNumber(1));
}

console.log(wacky2.plus(wacky2).get()); // Turns out, 2 + 2 isn't always 4.

// Wonder what's the min and max
const s = [];
for (let i = 0; i < 10000; i++) {
  let wacky2 = new FuzzyNumber(2);
  for (let j = 0; j < 10000; j++) {
    wacky2 = wacky2.times(new FuzzyNumber(1));
  }
  s.push(wacky2.plus(wacky2).get());
}

const min = s.reduce((acc, cur) => Math.min(acc, cur), Infinity);
const max = s.reduce((acc, cur) => Math.max(acc, cur), -Infinity);

const sums = s.reduce((acc, cur) => acc + cur, 0);
const means = sums / 10000;

const differenceSquareSums = s.reduce((acc, cur) => acc + (cur - mean) ** 2, 0);
const variances = differenceSquareSums / 10000;
const stdDevs = Math.sqrt(variances);

console.log(min, max, means, stdDevs); // Getting from about 0.3 to 30, but I saw a 72 once. 2 + 2 can equal 72, given some conditions.
// Mean: about 4 (lol), Std dev: about 4 as well
// Clearly, it's very skewed as well, forgot how to handle this statistically
// Perhaps this is more an exponential distribution or something???

// Ok, I'm done
// Thank you for your attention to this matter!!!
