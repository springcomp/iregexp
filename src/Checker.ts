/*
IRegexpChecker is pushdown automaton that very quickly determines if a
regular expression using a specified interoperable subset¹ is
syntactically correct.

¹ - https://www.ietf.org/archive/id/draft-bormann-jsonpath-iregexp-02.html

*/

/* This code is inspired from JSON_checker.c whose license is show hereafter. */

/* 2007-08-24 */

/*
Copyright (c) 2005 JSON.org
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
The Software shall be used for Good, not Evil.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

export type State = number;
export type Class = number;

const __: number = -1; // the universal error code

const C_NC: Class = 0; // normal char
const C_LPAR: Class = 1; // (
const C_RPAR: Class = 2; // )
const C_QU: Class = 3; // quantifier
const C_CMMA: Class = 4; // ,
const C_RNGE: Class = 5; // -
const C_DOT: Class = 6; // .
const C_DGIT: Class = 7; // 0-9
const C_UC: Class = 8; // C
const C_UL: Class = 9; // L
const C_UM: Class = 10; // M
const C_UN: Class = 11; // N
const C_UP: Class = 12; // P
const C_US: Class = 13; // S
const C_UZ: Class = 14; // Z
const C_LBRK: Class = 15; // [
const C_ESC: Class = 16; // \
const C_RBRK: Class = 17; // ]
const C_EXCL: Class = 18; // ^
const C_LC: Class = 19; // c
const C_LD: Class = 20; // d
const C_LE: Class = 21; // e
const C_LF: Class = 22; // f
const C_LI: Class = 23; // i
const C_LK: Class = 24; // k
const C_LL: Class = 25; // l
const C_LM: Class = 26; // m
const C_LN: Class = 27; // n
const C_LO: Class = 28; // o
const C_LP: Class = 29; // p
const C_LR: Class = 30; // r
const C_LS: Class = 31; // r
const C_LT: Class = 32; // s
const C_LU: Class = 33; // u
const C_LBRC: Class = 34; // {
const C_PIPE: Class = 35; // |
const C_RBRC: Class = 36; // }

const ascii_class: Class[] = [
    /*
        This array maps the 128 ASCII characters into character classes.
        The remaining Unicode characters are normal characters C_NC.
    */
    C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,
    C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,
    C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,
    C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,

    C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,
    C_LPAR, C_RPAR, C_QU,   C_QU,   C_CMMA, C_RNGE, C_DOT,  C_NC,
    C_DGIT, C_DGIT, C_DGIT, C_DGIT, C_DGIT, C_DGIT, C_DGIT, C_DGIT,
    C_DGIT, C_DGIT, C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_QU, 

    C_NC,   C_NC,   C_NC,   C_UC,   C_NC,   C_NC,   C_NC,   C_NC,
    C_NC,   C_NC,   C_NC,   C_NC,   C_UL,   C_UM,   C_UN,   C_NC,
    C_UP,   C_NC,   C_NC,   C_US,   C_NC,   C_NC,   C_NC,   C_NC,
    C_NC,   C_NC,   C_UZ,   C_LBRK, C_ESC,  C_RBRK, C_EXCL, C_NC,

    C_NC,   C_NC,   C_NC,   C_LC,   C_LD,   C_LE,   C_LF,   C_NC,
    C_NC,   C_LI,   C_NC,   C_LK,   C_LL,   C_LM,   C_LN,   C_LO,
    C_LP,   C_NC,   C_LR,   C_LS,   C_LT,   C_LU,   C_NC,   C_NC,
    C_NC,   C_NC,   C_NC,   C_LBRC, C_PIPE, C_RBRC, C_NC,   C_NC,
];

const GO: State = 0; //  start
const OK: State = 1; //  ok
const PI: State = 2; //  pipe
const QM: State = 3; //  qty min { requires digit
const QN: State = 4; //  qty min ... digit or ,
const QA: State = 5; //  qty max , requires digit
const QX: State = 6; //  qty max ... digit or }
const ES: State = 7; //  escape
const LB: State = 8; //  bracket [ 
const BR: State = 9; //  bracket [^ ... 
const BH: State = 10; // bracket [- ... 
const BE: State = 11; // bracket ... CCE1 or ]
const BI: State = 12; // bracket ... requires CCchar after ( "-" ccChar )
const BJ: State = 13; // bracket ... requires CCchar after ( "-" ccChar )
const BS: State = 14; // bracket \ escape sequence
const CP: State = 15; // char props \p
const CB: State = 16; // char props \p{
const PC: State = 17; // char props \p{C
const CC: State = 18; // char props \p{C
const PL: State = 19; // char props \p{L
const CL: State = 20; // char props \p{L
const PM: State = 21; // char props \p{M
const CM: State = 22; // char props \p{M
const PN: State = 23; // char props \p{N
const CN: State = 24; // char props \p{N
const PP: State = 25; // char props \p{P
const DP: State = 26; // char props \p{P
const PS: State = 27; // char props \p{S
const CS: State = 28; // char props \p{S
const PZ: State = 29; // char props \p{Z
const CZ: State = 30; // char props \p{Z

const state_transition_table: State[][] = [
  /*
  The state transition table takes the current state and the current symbol,
  and returns either a new state or an action. An action is represented as a
  negative number. A regular expression is accepted if at the end of the text
  the state is OK and if the mode is DONE.

                        NC    (    )  *+?    ,    -    .   0-9   C    L    M    N    P    S    Z    [    \    ]    ^    c    d    e    f    i    k    l    m    n    o    p    r    s    t   u    {    |    }
  /* start      GO */ [ -2,  -6,  __,  __,  -2,  __,  -2,  -2,  -2,  -2,  -2,  -2,  -2,  -2,  -2, -10,  ES,  __,  -2,  -2,  -2,  -2,  -2,  -2,  -2,  -2,  -2,  -2,  -2,  -2,  -2,  -2,  -2, -2,  __,  __,  __],
  /* ok         OK */ [ -2,  -6,  -7,  -3,  __,  __,  -2,  -2,  -2,  -2,  -2,  -2,  -2,  -2,  -2, -10,  ES,  __,  -2,  -2,  -2,  -2,  -2,  -2,  -2,  -2,  -2,  -2,  -2,  -2,  -2,  -2,  -2, -2,  -4,  -8,  __],
  /* pipe       PI */ [ -9,  -6,  __,  __,  __,  __,  -9,  __,  -9,  -9,  -9,  -9,  -9,  -9,  -9,  __,  __,  __,  -9,  -9,  -9,  -9,  -9,  -9,  -9,  -9,  -9,  -9,  -9,  -9,  -9,  -9,  -9, -9,  __,  __,  __],
  /* qty min    QM */ [ __,  __,  __,  __,  __,  __,  __,  QN,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __, __,  __,  __,  __],
  /* qty min    QN */ [ __,  __,  __,  __,  QA,  __,  __,  QN,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __, __,  __,  __,  -5],
  /* qty max    QA */ [ __,  __,  __,  __,  __,  __,  __,  QX,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __, __,  __,  __,  __],
  /* qty max    QX */ [ __,  __,  __,  __,  __,  __,  __,  QX,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __, __,  __,  __,  -5],
  /* escape     ES */ [ __,  OK,  OK,  OK,  __,  OK,  OK,  __,  __,  __,  __,  __,  CP,  __,  __,  OK,  OK,  OK,  OK,  __,  __,  __,  __,  __,  __,  __,  __,  OK,  __,  CP,  OK,  OK,  OK, __,  OK,  OK,  OK],
  /* range      LB */ [ BE,  BE,  BE,  BE,  BE,  BH,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  __,  BS,  __,  BR,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE, BE,  BE,  BE,  BE],
  /* range      BR */ [ BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  __,  BS,  __,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE, BE,  BE,  BE,  BE],
  /* range      BH */ [ BE,  BE,  BE,  BE,  BE,  __,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  __,  BS, -11,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE, BE,  BE,  BE,  BE],
  /* range      BE */ [ BE,  BE,  BE,  BE,  BE,  BI,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  __,  BS, -11,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE, BE,  BE,  BE,  BE],
  /* range      BI */ [ BJ,  BJ,  BJ,  BJ,  BJ,  __,  BJ,  BJ,  BJ,  BJ,  BJ,  BJ,  BJ,  BJ,  BJ,  __,  BS, -11,  BJ,  BJ,  BJ,  BJ,  BJ,  BJ,  BJ,  BJ,  BJ,  BJ,  BJ,  BJ,  BJ,  BJ,  BJ, BJ,  BJ,  BJ,  BJ],
  /* range      BJ */ [ BE,  BE,  BE,  BE,  BE,  __,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  __,  BS, -11,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  BE, BE,  BE,  BE,  BE],
  /* range      BS */ [ __,  BE,  BE,  BE,  BE,  BE,  BE,  BE,  __,  __,  __,  __,  BE,  __,  __,  BE,  BE,  BE,  BE,  __,  __,  __,  __,  __,  __,  __,  __,  BE,  __,  __,  BE,  BE,  BE, BE,  BE,  BE,  BE],
  /* char props CP */ [ __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __, __, -12,  __,  __],
  /* char props CB */ [ __,  __,  __,  __,  __,  __,  __,  __,  PC,  PL,  PM,  PN,  PP,  PS,  PZ,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __, __,  __,  __,  __],
  /* char \p{C} PC */ [ __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  CC,  __,  __,  CC,  __,  __,  __,  __,  CC,  CC,  __,  __,  __,  __, __,  __,  __, -13],
  /* char \p{C} CC */ [ __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __, __,  __,  __, -13],
  /* char \p{L} PL */ [ __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  CL,  CL,  __,  CL,  __,  __,  __,  CL, CL,  __,  __, -13],
  /* char \p{L} CL */ [ __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __, __,  __,  __, -13],
  /* char \p{M} PM */ [ __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  CM,  __,  CM,  __,  __,  __,  __,  __,  CM,  __,  __,  __,  __,  __, __,  __,  __, -13],
  /* char \p{M} CM */ [ __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __, __,  __,  __, -13],
  /* char \p{N} PN */ [ __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  CN,  __,  __,  __,  __,  CN,  __,  __,  CN,  __,  __,  __,  __, __,  __,  __, -13],
  /* char \p{N} CN */ [ __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __, __,  __,  __, -13],
  /* char \p{P} PP */ [ __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  DP,  DP,  DP,  DP,  DP,  __,  __,  __,  __,  DP,  __,  __,  DP,  __, __,  __,  __, -13],
  /* char \p{P} DP */ [ __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __, __,  __,  __, -13],
  /* char \p{S} PS */ [ __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  CS,  __,  __,  __,  __,  CS,  __,  CS,  __,  CS,  __,  __,  __,  __, __,  __,  __, -13],
  /* char \p{S} CS */ [ __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __, __,  __,  __, -13],
  /* char \p{Z} PZ */ [ __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  CZ,  __,  __,  __,  CZ,  __,  CZ,  __, __,  __,  __, -13],
  /* char \p{Z} CZ */ [ __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __,  __, __,  __,  __, -13],
];

// these modes can be pushed on the stack
export enum Mode {
  DONE,
  QUANTITY,
  PARENS,
  BRACKET,
  CPROPS,
}

class IRegexpChecker {

  constructor() {

    // starts the checking process by constructing a new
    // IRegexpChecker object.

    // To continue the process, call() check for each character
    // in the regular expression text, and then call finalCheck()
    // to obtain the final result.

    this.state = GO;
    this.offset = 0;
    this.stack = []
    this.quantifiable = false;
    this.push(Mode.DONE);
  }

  private state: State;
  private offset: number;
  private stack: Mode[];
  private quantifiable: boolean;

  public check(ch: number):void {

    // After constructing an IRegexpChecker object, call this
    // function for each character (or partial character) in 
    // the regular expression.
    // It returns if things are looking ok so far.
    // If it rejects the text, it throw an error.

    //console.log(`${this.offset} ch: ${ch}, state: ${this.state}`);

    let nextClass: Class = 0;
    let nextState: State = 0;

    // determine the character's class

    if (ch >= 128) {
      nextClass = C_NC;
    } else {
      nextClass = ascii_class[ch];
    }

    // get the next state from the state transition table

    nextState = state_transition_table[this.state][nextClass];

    //console.log(`${this.offset} ch: ${ch}, next state: ${nextState}, next class: ${nextClass}`);

    if (nextState >= 0) {
      // change the state
      this.state = nextState;
    } else {
      // or perform on of the actions
      switch (nextState){
        case -13: // \p{ ...}
          this.pop(Mode.CPROPS)
          this.state = OK;
          break;
        case -12: // \p{ or \P{
          this.push(Mode.CPROPS)
          this.state = CB;
          break;
        case -11: // [
          this.pop(Mode.BRACKET);
          this.state = OK;
          break;
        case -10: // [
          this.push(Mode.BRACKET);
          this.state = LB;
          break;
        case -9: // completed | branch
          this.quantifiable = true;
          this.state = OK;
          break;
        case -8: // |
          this.quantifiable = false;
          this.state = PI;
          break;
        case -7: // )
          this.pop(Mode.PARENS);
          this.quantifiable = true;
          this.state = OK;
          break;
        case -6: // (
          this.push(Mode.PARENS)
          this.quantifiable = false;
          this.state = GO;
          break;
        case -5: // }
          this.pop(Mode.QUANTITY);
          this.state = OK;
          break;
        case -4: // {
          this.push(Mode.QUANTITY);
          this.state = QM;
          break;
        case -3: // * + ?
          if (!this.quantifiable) {
            this.onError();
          }
          this.quantifiable = false;
          this.state = OK;
          break;
        case -2: // atom
          this.quantifiable = true;
          this.state = OK;
          break;
        default:
          this.onError();
      }
    }

    //console.log(`${this.offset} ch: ${ch}, next state: ${this.state}`);

    this.offset++;
  }

  public finalCheck(): void {
    // the finalCheck function shoud be called after all of the characters
    // have been processed, but only if every call to check returned
    // without throwing an error. This method throws an error if the
    // regular expression was not accepted; in other words, the final check failed.

    if (this.state !== OK) {
      this.onError();
    }

    this.pop(Mode.DONE);
  }
  private push(mode: Mode): void {
    // push a mode onto the stack.
    this.stack.push(mode);
  }
  private pop(mode: Mode): void {
    // pop the stack, ensuring the current mode matches the expectation
    // throw and error is the modes mismatch.
    if (this.stack.pop() !== mode) {
      this.onError();
    }
  }
  private onError(): void {
    throw new Error(`invalid regular expression at character offset ${this.offset}`);
  }
}

class IRegexp {
  public check(expression: string): boolean{
    try{
      const checker = new IRegexpChecker();
      [...expression]
        .map(s => s.codePointAt(0)!)
        .map(ch => checker.check(ch))
      ;
      checker.finalCheck();
      return true;
    }
    catch (e) {
      return false;
    }
  }
}

export const Checker = new IRegexp();
export default Checker;
