class IRegexpChecker {
  public check(expression: string): boolean {
    return expression !== null;
  }
}

export const Checker = new IRegexpChecker();
export default Checker;
