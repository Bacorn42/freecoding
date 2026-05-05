// 002 -- Grammar Executor
// Alright, the goal here is to implement grammars
// And then use them to generate random words

// First, we need the terminals and non-terminals
class Term {
  constructor(symbol) {
    this.symbol = symbol;
  }
}

class Terminal extends Term {}
class Nonterminal extends Term {}

// Now we need grammar rules
class Rule {
  constructor(inputTerm, outputTerms) {
    this.inputTerm = inputTerm;
    this.outputTerms = outputTerms;
  }
}

// Now the tree for the derivation
class Tree {
  constructor(term) {
    this.term = term;
    this.derivation = [];
  }

  derive(rules) {
    if (this.term instanceof Terminal) {
      return;
    }
    const options = rules[this.term.symbol];
    const idx = Math.floor(Math.random() * options.length);
    const rule = options[idx];
    for (const term of rule) {
      this.derivation.push(new Tree(term));
    }
    for (const d of this.derivation) {
      d.derive(rules);
    }
  }

  dfs(f) {
    f(this.term);
    for (const d of this.derivation) {
      d.dfs(f);
    }
  }
}

//And finally, grammar
class Grammar {
  constructor(startTerm) {
    this.rules = {};
    this.startTerm = startTerm;
  }

  addRule(rule) {
    if (this.rules[rule.inputTerm.symbol]) {
      this.rules[rule.inputTerm.symbol].push(rule.outputTerms);
    } else {
      this.rules[rule.inputTerm.symbol] = [rule.outputTerms];
    }
  }

  generateWord() {
    const tree = new Tree(this.startTerm);
    tree.derive(this.rules);

    const word = [];
    const callback = (term) => {
      if (term instanceof Terminal) {
        word.push(term.symbol);
      }
    };
    tree.dfs(callback);
    return word;
  }
}

// Lots of rules and symbols
const startSymbol = new Nonterminal("S");

const verb = new Nonterminal("V");
const noun = new Nonterminal("N");
const adjective = new Nonterminal("A");

const verbs = [
  "jumps",
  "walks",
  "runs",
  "punches",
  "eats",
  "jokes",
  "talks",
  "drinks",
  "jogs",
  "looks",
  "moves",
];
const verbSymbols = verbs.map((v) => new Terminal(v));

const nouns = [
  "chair",
  "table",
  "room",
  "paint",
  "eye",
  "I",
  "you",
  "he",
  "she",
  "it",
  "they",
  "we",
];
const nounSymbols = nouns.map((n) => new Terminal(n));

const adjectives = [
  "pretty",
  "ugly",
  "fast",
  "slow",
  "small",
  "big",
  "red",
  "yellow",
  "orange",
  "green",
  "blue",
  "purple",
  "dark",
  "light",
  "weird",
  "funny",
  "awesome",
];
const adjectiveSymbols = adjectives.map((a) => new Terminal(a));

const nounPhrase = new Nonterminal("NP");
const verbPhrase = new Nonterminal("VP");

const grammar = new Grammar(startSymbol);
grammar.addRule(new Rule(startSymbol, [nounPhrase, verbPhrase]));
grammar.addRule(new Rule(nounPhrase, [noun]));
grammar.addRule(new Rule(nounPhrase, [adjective, noun]));
grammar.addRule(new Rule(verbPhrase, [verb]));

for (const verbSymbol of verbSymbols) {
  grammar.addRule(new Rule(verb, [verbSymbol]));
}
for (const nounSymbol of nounSymbols) {
  grammar.addRule(new Rule(noun, [nounSymbol]));
}
for (const adjectiveSymbol of adjectiveSymbols) {
  grammar.addRule(new Rule(adjective, [adjectiveSymbol]));
}

const prepositionalPhrase = new Nonterminal("PP");
const preposition = new Nonterminal("P");

const prepositions = ["on", "in", "of", "at", "to"];
const prepositionSymbols = prepositions.map((p) => new Terminal(p));

grammar.addRule(new Rule(nounPhrase, [noun, prepositionalPhrase]));
grammar.addRule(new Rule(nounPhrase, [adjective, noun, prepositionalPhrase]));

grammar.addRule(new Rule(prepositionalPhrase, [preposition, nounPhrase]));

for (const prepositionSymbol of prepositionSymbols) {
  grammar.addRule(new Rule(preposition, [prepositionSymbol]));
}

grammar.addRule(new Rule(verbPhrase, [verb, nounPhrase]));
grammar.addRule(new Rule(verbPhrase, [verb, prepositionalPhrase]));

// LET'S GO!!!
for (let i = 0; i < 20; i++) {
  const word = grammar.generateWord();
  const sentence = word.join(" ").trim();
  const fixedSentence = sentence[0].toUpperCase() + sentence.slice(1) + ".";
  console.log(fixedSentence);
}
