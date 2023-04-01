import Checker from "./Checker";

export function check(expression: string): boolean {
  return Checker.check(expression);
}

export function ensureExpression(expression: string): [boolean, Error?] {
  try {
    Checker.check(expression, false);
    return [true, undefined];
  }
  catch (e) {
    if(e instanceof Error) {
      return [false, e];
    }
    return [false, new Error(`error parsing I-regexp expression: ${e}`)];
  }
}

export const iregexp = {
  check,
  ensureExpression,
};

export default iregexp;
