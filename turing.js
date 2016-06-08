var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Parser.TableParser = (function() {
  function TableParser() {
    this.getBasicConfig = bind(this.getBasicConfig, this);
    this.getValue = bind(this.getValue, this);
    this.allStates = [];
    this.alpha = "";
    this.blank = "";
    this.inputs = [];
    this.initial = 0;
    this.final = [];
    this.transitions = {};
  }

  TableParser.prototype.getValue = function(id) {
    return document.getElementById(id).getAttribute("value");
  };

  TableParser.prototype.getBasicConfig = function() {
    var col, currInp, currState, i, inp, inpSymbols, inputsTable, j, k, l, len, len1, len2, len3, nameSpan, ref, row, state, stateNames, t, table, tbodyRows, temp, theads, toState, txt;
    this.allStates = (this.getValue("states") || "0, 1, 2").split(/\s*,\s*/);
    this.alpha = (this.getValue("alphabet") || "0, 1, B").split(/\s*,\s*/);
    this.blank = this.getValue("blank") || "B";
    this.inputs = (this.getValue("inputs") || "0, 1, B").split(/\s*,\s*/);
    this.initial = this.getValue("initial") || [0];
    this.final = (this.getValue("final") || "2").split(/\s*,\s*/);
    inpSymbols = [];
    inputsTable = document.getElementById("table-left").getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    for (i = 0, len = inputsTable.length; i < len; i++) {
      row = inputsTable[i];
      inpSymbols.push(row.getElementsByTagName("td")[0].innerHTML);
    }
    table = document.getElementById("state-table");
    tbodyRows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    theads = table.getElementsByTagName("thead")[0].getElementsByTagName("tr")[1].getElementsByTagName("th");
    stateNames = [];
    for (j = 0, len1 = theads.length; j < len1; j++) {
      nameSpan = theads[j];
      stateNames.push(nameSpan.getElementsByTagName("div")[0].innerHTML);
    }
    inp = 0;
    state = 0;
    for (k = 0, len2 = tbodyRows.length; k < len2; k++) {
      row = tbodyRows[k];
      currInp = inpSymbols[inp];
      temp = [];
      ref = row.getElementsByTagName("td");
      for (l = 0, len3 = ref.length; l < len3; l++) {
        col = ref[l];
        currState = stateNames[state];
        txt = col.getElementsByTagName("div")[0].innerHTML;
        if ((txt == null) || txt === null) {
          toState = this.transitions[currState] || {};
          toState[currInp] = null;
          this.transitions[currState] = toState;
          continue;
        }
        txt = txt.split(/\s*,\s*/);
        console.log("txt: ", txt);
        t = {
          next: txt[0],
          move: txt[1],
          write: txt[2]
        };
        temp.push(t);
        state = (state + 1) % stateNames.length;
        toState = this.transitions[currState] || {};
        toState[currInp] = t;
        this.transitions[currState] = toState;
      }
      inp++;
    }
    console.log("transitions: ", this.transitions);
    return this.transitions;
  };

  return TableParser;

})();

var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Turing.TuringMachine = (function() {
  function TuringMachine(config) {
    this.step = bind(this.step, this);
    this.config = config;
    this.alpha = config.alpha;
    this.input = config.input;
    this.states = config.states;
    this.blank = config.blank;
    this.initial = config.initial;
    this.final = config.final;
    this.transitions = config.transitions;
    this.band = [];
    this.currPos = 0;
    this.currState = this.initial;
    this.halt = false;
    this.accept = false;
    this.directions = {
      "R": 1,
      "L": -1,
      "N": 0
    };
  }

  TuringMachine.prototype.setBand = function(input) {
    this.band = input.split("");
    return this.band.push(this.blank);
  };

  TuringMachine.prototype.reset = function(input) {
    if (input != null) {
      this.setBand(input);
    }
    this.halt = false;
    this.accept = false;
    this.currPos = 0;
    return this.currState = this.initial;
  };

  TuringMachine.prototype.read = function() {
    return this.band[this.currPos];
  };

  TuringMachine.prototype.write = function(w) {
    return this.band[this.currPos] = w;
  };

  TuringMachine.prototype.move = function(direction) {
    var d;
    d = this.directions[direction];
    if (d != null) {
      d = 1;
    }
    return this.currPos += d;
  };

  TuringMachine.prototype.step = function() {
    var r, trans;
    if (this.halt) {
      console.log("Already completed");
      return this.accepted;
    }
    if (this.band.length === 0) {
      return false;
    }
    if (this.currPos > this.band.length) {
      this.shouldHalt(null);
      return this.accept;
    }
    r = this.read();
    trans = this.transitions[this.currState][r];
    this.shouldHalt(trans);
    if (trans != null) {
      this.write(trans.write);
      this.move(trans.move);
      return this.currState = trans.next;
    }
  };

  TuringMachine.prototype.shouldHalt = function(trans) {
    var ref;
    if (trans === null || trans === void 0) {
      this.halt = true;
      this.accept = (ref = this.currState, indexOf.call(this.final, ref) >= 0);
      return true;
    }
    return false;
  };

  TuringMachine.prototype.work = function() {
    var results;
    results = [];
    while (!this.halt) {
      results.push(this.step());
    }
    return results;
  };

  TuringMachine.prototype.buildHTML = function() {
    return console.log("building html");
  };

  return TuringMachine;

})();

var click, createTable, defaultTM, makeStep, parser, runTM, tm;

console.log("main file here");

defaultTM = {
  alpha: ["1", "0", "B"],
  input: ["1", "0", "B"],
  states: 3,
  blank: "B",
  initial: 0,
  final: [2],
  transitions: {
    "0": {
      "1": {
        next: 1,
        move: "R",
        write: "B"
      },
      "0": {
        next: 0,
        move: "R",
        write: "B"
      },
      "B": {
        next: 2,
        move: "N",
        write: "B"
      }
    },
    "1": {
      "1": {
        next: 0,
        move: "R",
        write: "B"
      },
      "0": {
        next: 1,
        move: "R",
        write: "B"
      },
      "B": {
        next: 1,
        move: "R",
        write: "B"
      }
    },
    "2": {
      "1": null,
      "0": null,
      "B": null
    }
  }
};

tm = new Turing.TuringMachine(defaultTM);

tm.reset("1001100111100101100101111011111110010001110010010010110011010000001000010101011101000110010110110011010111101110110111101010010101110011001111100101000000111010010000000101100010000110010011100001011000000101010001011010001001010101000100101010001000100110100010001000001101011001000101111001000011101111000001101100111011001111010010111000010100011101101000100101010110001101010000001001010000101101101011100011010011000011010111001111101100111101001010000001101100000101110100001010101010111111100010001101101010010011010000010011000000110100010110010000100011010000000100101011110001100011001101001010101000011001110100100010000001000011010011101000000001110111001110100010110110100111010111001001101011000110011110101000010001111101110001011001101010000000011101111010111000110111101011111011000011111001000000000110101111010100100101101010110011000111011011011000110110111011110111111000101000110101111000000010010000011101111011111001110100100111100011001101100111100111111010110111001001101001");

tm.work();

console.log("Accepts: " + tm.accept);

parser = new Parser.TableParser();

parser.getBasicConfig();

console.log(parser);

click = function(id, func) {
  return document.getElementById(id).addEventListener('click', func);
};

createTable = function(e) {
  e.preventDefault();
  return tm.buildHTML();
};

makeStep = function(e) {
  e.preventDefault();
  return tm.step();
};

runTM = function(e) {
  e.preventDefault();
  return tm.work();
};

click("build-table", createTable);

click("run-button", runTM);

click("step-button", makeStep);
