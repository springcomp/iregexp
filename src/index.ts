import Checker from "./Checker";

export function check(expression: string): boolean {
  return Checker.check(expression);
}

export function ensureExpression(expression: string): void {
    Checker.check(expression, false);
}

export const iregexp = {
  check,
  ensureExpression,
};

export default iregexp;
