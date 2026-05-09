// I'm coming into this without any plan today
// So this is a true stream-of-consciousness freewrite

// Let's start with a number
let x = 12;

// It's a nice number
// Very nice, very composite
// It has factors of 1 (duh), 2, 3, 4, 6, and 12 (duh)
// Let's get them
function getFactors(n) {
  const factors = new Set();
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      factors.add(i);
      factors.add(n / i);
    }
  }
  return [...factors].toSorted((a, b) => a - b);
}

console.log(getFactors(12)); // Cool, we have factors now
// In O(sqrt(n)) time!

// Now, what if numbers have factors in common?
// Like 12 has: 1, 2, 3, 4, 6, 12
// And 30 has: 1, 2, 3, 5, 6, 10, 15, 30
// That's: 1, 2, 3, 6 that are common
// And not common are 4 and 12 from 12; 5, 10, 15, 30 from 30
// Hmmm... their least common multiple is 60, that requires some factor of 5, that's not common. But also 2 which is common
// Perhaps prime factors then?
// 12 = 3 * 2 * 2
// 30 = 5 * 3 * 2
// Common: 3 and 2
// Hmmm...
// The way to get 60 = 5 * 3 * 2 * 2 is...
// Take the "unique" ones!!!
// Like 3 and 2 match up. So take just 1. And each of the remaining ones. You get: 5, 3, 2, 2
// Ok, let's see

function getPrimeFactors(n) {
  const factors = [];
  let testFactor = 2;
  while (n > 1) {
    if (n % testFactor === 0) {
      n /= testFactor;
      factors.push(testFactor);
      testFactor = 2;
    } else {
      testFactor++;
    }
  }
  return factors;
}

console.log(getPrimeFactors(12));
console.log(getPrimeFactors(30));

// Now time for a funny lcm algorithm
function lcm(n, m) {
  const factorsN = getPrimeFactors(n);
  const factorsM = getPrimeFactors(m);

  let ptrN = 0;
  let ptrM = 0;
  let lcm = 1;
  while (ptrN < factorsN.length && ptrM < factorsM.length) {
    if (factorsN[ptrN] === factorsM[ptrM]) {
      lcm *= factorsN[ptrN];
      ptrN++;
      ptrM++;
    } else if (factorsN[ptrN] > factorsM[ptrM]) {
      lcm *= factorsM[ptrM];
      ptrM++;
    } else if (factorsN[ptrN] < factorsM[ptrM]) {
      lcm *= factorsN[ptrN];
      ptrN++;
    }
  }
  while (ptrN < factorsN.length) {
    lcm *= factorsN[ptrN];
    ptrN++;
  }
  while (ptrM < factorsM.length) {
    lcm *= factorsM[ptrM];
    ptrM++;
  }
  return lcm;
}

console.log(lcm(12, 30)); // 60
console.log(lcm(13, 17)); // 221
console.log(lcm(8, 800)); // 800
// Hell yeah, seems to work!

// Now, how do primes work with gcd?
// gcd(12, 30) is 6
// 12 = 3 * 2 * 2
// 30 = 5 * 3 * 2
// 6 = 3 * 2
// So... just the common ones? Makes sense

function gcd(n, m) {
  const factorsN = getPrimeFactors(n);
  const factorsM = getPrimeFactors(m);

  let ptrN = 0;
  let ptrM = 0;
  let gcd = 1;
  while (ptrN < factorsN.length && ptrM < factorsM.length) {
    if (factorsN[ptrN] === factorsM[ptrM]) {
      gcd *= factorsN[ptrN];
      ptrN++;
      ptrM++;
    } else if (factorsN[ptrN] > factorsM[ptrM]) {
      ptrM++;
    } else if (factorsN[ptrN] < factorsM[ptrM]) {
      ptrN++;
    }
  }
  return gcd;
}

console.log(gcd(12, 30)); // 6
console.log(gcd(13, 17)); // 1
console.log(gcd(8, 800)); // 8
// Also seems to work, nice!
// I imagine Euclid's algorithm does exactly that just in a more subtle way

// Anyway, that's all I have for today.
// Good nitrogen!
