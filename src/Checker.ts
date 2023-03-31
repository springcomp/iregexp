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
const C_QU: Class = 1; // quantifier
const C_LBRC: Class = 2; // {
const C_RBRC: Class = 3; // }
const C_DGIT: Class = 4; // 0-9
const C_CMMA: Class = 5; // ,
const C_LPAR: Class = 6; // (
const C_RPAR: Class = 7; // )

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
    C_LPAR, C_RPAR, C_QU,   C_QU,   C_CMMA, __,     __,     C_NC,
    C_DGIT, C_DGIT, C_DGIT, C_DGIT, C_DGIT, C_DGIT, C_DGIT, C_DGIT,
    C_DGIT, C_DGIT, C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_QU, 

    C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,
    C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,
    C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,
    C_NC,   C_NC,   C_NC,   __,     __,     __,     C_NC,   C_NC,

    C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,
    C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,
    C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,   C_NC,
    C_NC,   C_NC,   C_NC,   C_LBRC, __,     C_RBRC, C_NC,   C_NC,
];

const GO: State = 0; //  start
const OK: State = 1; //  ok
const QM: State = 2; //  qty min { requires digit
const QN: State = 3; //  qty min ... digit or ,
const QA: State = 4; //  qty max , requires digit
const QX: State = 5; //  qty max ... digit or }

const state_transition_table: State[][] = [
  /*
  The state transition table takes the current state and the current symbol,
  and returns either a new state or an action. An action is represented as a
  negative number. A regular expression is accepted if at the end of the text
  the state is OK and if the mode is DONE.

                                   DGIT
                     NC  QU   {   }   |   ,   (   )  */
  /* start    GO */ [-2, __, __, __, -2, -2, -6, __],
  /* ok       OK */ [-2, -3, -4, __, -2, __, -6, -7],
  /* qty min  QM */ [__, __, __, __, QN, __, __, __],
  /* qty min  QN */ [__, __, __, -5, QN, QA, __, __],
  /* qty max  QA */ [__, __, __, __, QX, __, __, __],
  /* qty max  QX */ [__, __, __, -5, QX, __, __, __],
];

// these modes can be pushed on the stack
export enum Mode {
  DONE,
  QUANTITY,
  PARENS,
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
      ////console.log(nextClass);
      //if (nextClass <= __){
      //  this.onError();
      //}
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
