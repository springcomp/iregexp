import { check } from "../src";

export function pass(expression: string): void {
  expect(check(expression)).toEqual(true);
}
export function fail(expression: string): void {
	let succeeded = false;
	try{
		succeeded = check(expression);
	}
	catch(e){
		expect(e).toBeInstanceOf(Error);
	}

	if (succeeded){
		throw new Error(`the expression ${expression} was incorrectly considered a valid regular expression.`);
	}
}