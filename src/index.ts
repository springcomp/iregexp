import Checker from "./Checker";

export function check(expression: string): boolean {
  return Checker.check(expression);
}

export const iregexp = {
  check,
};

export default iregexp;
