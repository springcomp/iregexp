import Checker from "./Checker";

export function check(expression: string): boolean {
  return Checker.check(expression);
}

export function ensureExpression(expression: string): void {
  try {
    Checker.check(expression, false);
  }
  catch (e) {
    if(e instanceof Error) {
      throw e;
    }
    throw new Error(`error parsing I-regexp expression: ${e}`);
  }
}

export const iregexp = {
  check,
  ensureExpression,
};

export default iregexp;
