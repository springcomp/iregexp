import Checker from "./Checker";

/**
   * Checks a given expression is syntactically valid I-Regexp.
   *
   * @param expression - The I-Regexp expression
   * @returns boolean value
   *
   */
export function check(expression: string): boolean {
  const [ok, __] = Checker.check(expression);
  return ok;
}

/**
   * Ensures a given expression is syntactically valid I-Regexp.
   *
   * @param expression - The I-Regexp expression
   * @throws Error if the expression is invalid
   *
   */
export function ensureExpression(expression: string): void {
    Checker.check(expression, false);
}

/**
   * Converts an I-Regexp expression to its ECMAScript equivalent.
   *
   * @param expression - The I-Regexp expression
   * @throws Error if the expression is invalid
   *
   */
export function toECMAScript(expression: string, anchor: boolean = false): string {
  const [_, expr] = Checker.check(expression, false);
  const regex = <string>expr;
  const result = anchor ? `^(?:${regex})$` : regex;
  return result;
}

export const iregexp = {
  check,
  ensureExpression,
  toECMAScript,
};

export default iregexp;
