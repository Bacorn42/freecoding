// So, the idea this time is to get Yahtzee combinations (4 of a kind, full house, etc.)
// And convert them to base 10 and observe some properties. Maybe.

// Starting with the conversion
// [1, 1, 1, 1, 1] should be 0
// [6, 6, 6, 6, 6] should be 7775
function rollToBase10(roll) {
    let sum = 0;
    let factor = 1;
    for (let i = roll.length - 1; i >= 0; i--) {
        sum += (roll[i] - 1) * factor;
        factor *= 6;
    }
    return sum;
}

console.log(rollToBase10([1, 1, 1, 1, 1])); // 0
console.log(rollToBase10([6, 6, 6, 6, 6])); // 7775
console.log(rollToBase10([1, 2, 3, 4, 5])); // 216 + 2 * 36 + 3 * 6 + 4 = 216 + 72 + 18 + 4 = 310

// Now we test for various combinations
function getFrequencyCounts(roll) {
    const counts = {};
    for (const r of roll) {
        if (!counts[r]) {
            counts[r] = 0;
        }
        counts[r]++;
    }
    return counts;
}

function isNOfAKind(roll, n) {
    const counts = getFrequencyCounts(roll);
    for (const val of Object.values(counts)) {
        if (val === n) {
            return true;
        }
    }
    return false;
}

function isFullHouse(roll, n) {
    return isNOfAKind(roll, 3) && isNOfAKind(roll, 2);
}

function isStraight(roll, type) {
    const sortedRoll = roll.toSorted();
    for (let i = 0; i < roll.length; i++) {
        if (
            (type === "small" && sortedRoll[i] !== i + 1) ||
            (type === "large" && sortedRoll[i] !== i + 2)
        ) {
            return false;
        }
    }
    return true;
}

console.log(isFullHouse([2, 4, 2, 4, 2])); // true
console.log(isFullHouse([2, 4, 2, 3, 2])); // false
console.log(isNOfAKind([5, 5, 5, 5, 6], 4)); // true
console.log(isNOfAKind([5, 5, 5, 3, 6], 4)); // false
console.log(isStraight([3, 5, 2, 4, 1], "small")); // true
console.log(isStraight([3, 6, 2, 4, 5], "large")); // true
console.log(isStraight([3, 5, 2, 4, 1], "large")); // false
// Ok, should be enough

function generateAllRolls(n) {
    const rolls = [];

    function rollGenerator(k, roll) {
        if (k === 0) {
            rolls.push(roll); // CLOSURE!
            return;
        }
        for (let i = 1; i <= 6; i++) {
            r = [...roll, i];
            rollGenerator(k - 1, r);
        }
    }
    rollGenerator(n, []);
    return rolls;
}

console.log(generateAllRolls(1).length); // 6
console.log(generateAllRolls(2).length); // 36
console.log(generateAllRolls(3).length); // 216
console.log(generateAllRolls(4).length); // 1296
console.log(generateAllRolls(5).length); // 7776

// Need some fancy functional helpers here
const isNOfAKindFilter = (n) => (roll) => isNOfAKind(roll, n);
const isStraightType = (type) => (roll) => isStraight(roll, type);
const processRolls = (n, filterFunc) => generateAllRolls(n).filter(filterFunc).map(rollToBase10);

console.log(processRolls(5, isNOfAKindFilter(5))); // All 5 of a kinds converted to base 10
console.log(processRolls(5, isNOfAKindFilter(4)));
console.log(processRolls(5, isFullHouse));

// Well, I'm seeing some clusters. Not sure what to make of it...
// Perhaps differences?
function getDifferences(arr) {
    const differences = [];
    for (let i = 0; i < arr.length - 2; i++) {
        differences.push(arr[i + 1] - arr[i]);
    }
    return differences;
}

console.log(getDifferences(processRolls(5, isNOfAKindFilter(4)))); // Definitely seeing some recurring numbers
console.log(getDifferences(processRolls(5, isFullHouse))); // Hmmm... maybe? Definitely some groups of small numbers indicating clusters

console.log(processRolls(5, isStraightType("small")));
console.log(getDifferences(processRolls(5, isStraightType("small")))); // Oh that looks pretty regular, all multiples of 5

console.log(processRolls(5, isStraightType("large")));
console.log(getDifferences(processRolls(5, isStraightType("large")))); // Very similar

// That's all I got
// Well, I've learned nothing from this experience
// But it was fun
