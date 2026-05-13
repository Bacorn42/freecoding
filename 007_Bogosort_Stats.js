// I wanna see how spread out bogosort is
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const idx = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[idx]] = [arr[idx], arr[i]];
  }
}

function countCorrect(arr) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === i) {
      count++;
    }
  }
  return count;
}

const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
const iters = 100_000_000;
const instances = new Array(21).fill(0);
for (let i = 0; i < iters; i++) {
  shuffle(arr);
  const correct = countCorrect(arr);
  instances[correct]++;
}

function paddedStr(str, length) {
  return String(str).padStart(length, " ");
}

console.log("[" + paddedStr(12.3, 5) + "]");
console.log("[" + paddedStr(1234, 5) + "]");
console.log("[" + paddedStr(0.05, 5) + "]");

const ratios = instances.map((i) => i / iters);
for (let i = 0; i < ratios.length; i++) {
  const ratio = ratios[i];
  const amount = paddedStr(i, 2);
  const percentage = paddedStr((ratio * 100).toFixed(2) + "%", 7);
  const barLength = Math.ceil(ratio * 100);
  const bar = "#".repeat(barLength);
  const hits = paddedStr(instances[i], String(iters).length);
  console.log(`${amount}: ${hits} [${percentage}] ${bar}`);
}

//  0:  36784716 [ 36.78%] #####################################
//  1:  36790752 [ 36.79%] #####################################
//  2:  18391866 [ 18.39%] ###################
//  3:   6133611 [  6.13%] #######
//  4:   1532011 [  1.53%] ##
//  5:    307770 [  0.31%] #
//  6:     50926 [  0.05%] #
//  7:      7339 [  0.01%] #
//  8:       897 [  0.00%] #
//  9:       103 [  0.00%] #
// 10:         9 [  0.00%] #
// 11:         0 [  0.00%]
// 12:         0 [  0.00%]
// 13:         0 [  0.00%]
// 14:         0 [  0.00%]
// 15:         0 [  0.00%]
// 16:         0 [  0.00%]
// 17:         0 [  0.00%]
// 18:         0 [  0.00%]
// 19:         0 [  0.00%]
// 20:         0 [  0.00%]
