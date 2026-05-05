// Alright, we're doing an economy simulation here
// There will be companies
// Their stock will fluctuate
// And then I'll make an index based on the evolving companies
// Do I know how the stock market REALLY works? No.
// Let's go!

const COMPANIES = 50;
const DAYS = 50;

class Company {
  constructor(name, initialStockValue) {
    this.name = name;
    this.stockValue = Math.round(initialStockValue * 100) / 100;
    this.shares = 1000 + Math.floor(Math.random() * 1000);
  }

  update(dailyBias) {
    if (this.stockValue === 0) {
      return;
    }
    const change = dailyBias + (Math.random() - 0.5);
    this.stockValue *= 1 + change;
    this.stockValue = Math.round(this.stockValue * 100) / 100;
    if (this.stockValue < 0) {
      this.stockValue = 0;
    }
  }

  marketCap() {
    return Math.round(this.shares * this.stockValue * 100) / 100;
  }
}

class Fund {
  constructor(companies) {
    this.companies = companies;
  }

  setCompanies(companies) {
    this.companies = companies;
  }

  marketCap() {
    let sum = 0;
    for (const company of companies) {
      sum += company.marketCap();
    }
    return sum;
  }

  value() {
    let sum = 0;
    const totalMarketCap = this.marketCap();
    for (const company of this.companies) {
      const weight = company.marketCap() / totalMarketCap;
      sum += company.stockValue * weight;
    }
    return Math.round((sum / this.companies.length) * 100) / 100;
  }
}

const existingCompanies = new Set();

function companyNameGenerator() {
  const words = {
    material: [
      "Wood",
      "Steel",
      "Plastic",
      "Glass",
      "Stone",
      "Iron",
      "Bronze",
      "Brass",
      "Copper",
      "Coal",
      "Quartz",
    ],
    tech: [
      "Computer",
      "Semiconductor",
      "Wire",
      "Transformer",
      "Power",
      "Electricity",
      "Monitor",
      "Speaker",
      "Device",
    ],
    retail: ["Store", "Warehouse", "Shop", "Market", "Supermarket", "Chain", "Mall"],
    items: [
      "Book",
      "Vitamin",
      "Box",
      "Website",
      "Finger",
      "Wallet",
      "Pants",
      "Shirt",
      "Maple",
      "Oak",
      "Ball",
    ],
  };

  const types = Object.keys(words);
  const type = types[Math.floor(Math.random() * types.length)];
  const instance = words[type][Math.floor(Math.random() * words[type].length)];

  const type2 = types[Math.floor(Math.random() * types.length)];
  const instance2 = words[type2][Math.floor(Math.random() * words[type2].length)];

  const suffixes = ["Inc.", "Corp.", ""];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

  const name = [instance, instance2, suffix].join(" ").trim();
  if (existingCompanies.has(name)) {
    return companyNameGenerator();
  }
  existingCompanies.add(name);
  return name;
}

const companies = [];
for (let i = 0; i < COMPANIES; i++) {
  const name = companyNameGenerator();
  const initialValue = 1 + Math.random() * 10;
  companies.push(new Company(name, initialValue));
}

function sortCompanies(companies) {
  companies.sort((a, b) => b.marketCap() - a.marketCap());
}

sortCompanies(companies);
const S_P_10 = new Fund(companies.slice(0, 10));

for (let i = 1; i <= DAYS; i++) {
  sortCompanies(companies);
  S_P_10.setCompanies(companies.slice(0, 10));
  console.log(`DAY ${i} OPEN: ${S_P_10.value()}`);

  const dailyBias = (Math.random() - 0.5) * Math.random() + 0.02;
  for (const company of companies) {
    company.update(dailyBias);
  }
  console.log(`DAY ${i} CLOSE: ${S_P_10.value()}`);
}

for (const company of companies) {
  console.log(`${company.name} ${company.stockValue} ${company.marketCap()}`);
}
