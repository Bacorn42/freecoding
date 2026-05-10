function generateTextbox(label) {
  return `<label>${label}<input type="text"></label>`;
}

function generateCheckbox(label) {
  return `<label><input type="checkbox">${label}</label>`;
}

function generateRadio(labels) {
  const id = crypto.randomUUID();
  return labels
    .map((l) => `<div><label><input type="radio" name="${id}">${l}</label></div>`)
    .join("");
}

function generateTextarea(label) {
  return `<label>${label}<textarea></textarea></label>`;
}

function generateLabel() {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const length = Math.floor(Math.random() * 6) + 3;
  let word = "";
  for (let i = 0; i < length; i++) {
    word += letters[Math.floor(Math.random() * letters.length)];
  }
  return word;
}

function generateItem() {
  const rand = Math.random();
  if (rand < 0.25) {
    return generateTextbox(generateLabel());
  }
  if (rand < 0.5) {
    return generateCheckbox(generateLabel());
  }
  if (rand < 0.75) {
    const labelsAmount = Math.floor(Math.random() * 4) + 2;
    const labels = [];
    for (let i = 0; i < labelsAmount; i++) {
      labels.push(generateLabel());
    }
    return generateRadio(labels);
  }
  return generateTextarea(generateLabel());
}

function generateRow(items) {
  return `<tr>${items.map((item) => `<td>${item}</td>`).join("")}</tr>`;
}

function generateTable(columns, items) {
  let html = "";
  for (let i = 0; i < items.length; i += columns) {
    html += generateRow(items.slice(i, i + columns));
  }
  return `<table>${html}</table>`;
}

function generateForm() {
  const columns = Math.floor(Math.random() * 4) + 1;
  const rows = Math.floor(Math.random() * 8) + 2;
  const itemsAmount = columns * rows;
  const items = [];
  for (let i = 0; i < itemsAmount; i++) {
    items.push(generateItem());
  }

  const html = generateTable(columns, items);
  console.log(html);
  document.body.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", function () {
  generateForm();
});
