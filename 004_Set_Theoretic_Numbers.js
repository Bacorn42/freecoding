// Today's idea is to implement numbers as sets

// There is only one empty set, and thus we will use a global reference
const e = new Set();

function succ(n) {
  return new Set(n).add(n);
}

function toStr(n) {
  if (n === e) {
    return "{}";
  }
  return `{${[...n].map((m) => toStr(m)).join(",")}}`;
}

console.log(toStr(succ(succ(e)))); // {{},{{}}}

// Now let's actually get numbers
function toSet(n) {
  if (n === 0) {
    return e;
  }
  let set = e;
  for (let i = 0; i < n; i++) {
    set = succ(set);
  }
  return set;
}

console.log(toStr(toSet(2))); // {{},{{}}}, very cool
//console.log(toStr(toSet(20))); // Woah

// Now let's do addition using funny recursive formula
// m + 0 = m, m + succ(n) = succ(m + n)

// First, predecessor
function pred(n) {
  if (n === e) {
    throw new Exception("Numbers below 0 don't exist");
  }
  const [set, ...rest] = n;
  if (rest.length === 0) {
    return set;
  }
  const result = new Set(set);
  for (const other of rest) {
    for (const elem of other) {
      result.add(elem); // Wonky but seems to work
    }
  }
  return result;
}

console.log(toStr(toSet(8)) === toStr(pred(toSet(9)))); // yeeee, FINALLY

// Let's make it a utility
function isEqual(m, n) {
  return toStr(m) === toStr(n);
}

console.log(isEqual(toSet(8), pred(toSet(9))));

// Now let's try addition
// m + 0 = m, m + succ(n) = succ(m + n)
function add(m, n) {
  if (n === e) {
    return m;
  }
  return succ(add(m, pred(n)));
}

console.log(add(toSet(1), toSet(2))); // ACTUALLY WORKS

console.log(isEqual(add(toSet(7), toSet(5)), toSet(12))); // 7 + 5 = 12, wWOOWW

// Does multiplication work the same way?
function multiply(m, n) {
  if (isEqual(n, toSet(1))) {
    return m;
  }
  return add(multiply(m, pred(n)), m);
}

console.log(isEqual(multiply(toSet(3), toSet(4)), toSet(12))); // 3 * 4 = 12 YEAIPBNOVHNODOD

console.log(isEqual(multiply(add(toSet(1), toSet(2)), add(toSet(3), toSet(4))), toSet(21))); // (1 + 2) * (3 + 4) = 3 * 7 = 21

// Power?
function power(m, n) {
  if (isEqual(n, toSet(1))) {
    return m;
  }
  return multiply(power(m, pred(n)), m);
}

console.log(isEqual(power(toSet(2), toSet(4)), toSet(16))); // 2 ** 4 = 16 oooooOoooOOoooOOOooooOOOOOOOOOOOOOOOOO!!!
// Any comparison over like 24 takes forever, hmmm
console.log(toStr(toSet(22)).length);
console.log(toStr(toSet(23)).length);
console.log(toStr(toSet(24)).length); // Oh yeah, length is about 10 * 2 ** n, cool

// So testing 3 ** 3 = 27 would be generating and comparing strings of length about 1.34 billion

console.log(isEqual(power(toSet(5), toSet(2)), multiply(toSet(5), toSet(5))));

console.log(
  isEqual(
    power(succ(succ(succ(succ(succ(e))))), succ(succ(e))),
    multiply(succ(succ(succ(succ(succ(e))))), succ(succ(succ(succ(succ(e)))))),
  ),
);

// Well, this was more intense than I thought it'd be.
