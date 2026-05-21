// Some globals
const MIN_X = -10;
const MAX_X = 10;

// Alright, let's do this in sequence
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("button").addEventListener("click", () => {
    const input = document.getElementById("input").value;
    const transformedInput = transform(input);
    const values = evaluate(transformedInput);
    drawGraph(values);
  });
});

// Transform input needs to do stuff like:
// 2x to 2*x
// 3^x to 3**x
// sqrt(x) to Math.sqrt(x)
// probably other stuff but I don't care
function transform(input) {
  return input
    .replaceAll(/(\d+)x/g, "$1*x")
    .replaceAll("^", "**")
    .replaceAll("sqrt", "Math.sqrt")
    .replaceAll("x", "(x)");
}

// Eval is evil
function evil(input) {
  return eval(input);
}

// We will evaluate in a funny way:
// eval and replace x with the values
function evaluate(input) {
  const values = [];
  const CANVAS_WIDTH = document.getElementById("graph").width;
  const increment = (MAX_X - MIN_X) / CANVAS_WIDTH;
  for (let x = MIN_X; x < MAX_X; x += increment) {
    const inputXd = input.replaceAll("x", x);
    const value = evil(inputXd);
    values.push({ x, value });
  }
  return values;
}

// And now we draw onto canvas
// I spent way too much time translating these coordinates correctly
function drawGraph(values) {
  const canvas = document.getElementById("graph");
  const ctx = canvas.getContext("2d");
  const coefficient = canvas.width / (MAX_X - MIN_X);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "black";
  ctx.fillRect(0, canvas.height / 2, canvas.width, 1);
  ctx.fillRect(canvas.width / 2, 0, 1, canvas.height);
  for (let i = MIN_X; i < MAX_X; i++) {
    const xCoord = (i - MIN_X) * coefficient;
    const yCoord = -i * coefficient + canvas.height / 2;
    ctx.fillRect(xCoord, canvas.height / 2 - 10, 1, 20);
    ctx.fillRect(canvas.width / 2 - 10, yCoord, 20, 1);
  }

  ctx.fillStyle = "red";

  for (const { x, value } of values) {
    const absoluteX = (x - MIN_X) * coefficient;
    const absoluteY = -value * coefficient + canvas.height / 2;
    ctx.fillRect(absoluteX, absoluteY, 2, 2);
  }
}
