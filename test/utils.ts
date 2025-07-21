import { check, toECMAScript } from "../src";

export function pass(expression: string | number): void {
	expect(check(get(expression))).toEqual(true);
}
export function fail(expression: string | number): void {
	let succeeded = false;
	try {
		succeeded = check(get(expression));
	} catch (e) {
		expect(e).toBeInstanceOf(Error);
	}

	if (succeeded) {
		throw new Error(
			`the expression ${get(expression)} was incorrectly considered a valid regular expression.`,
		);
	}
}
export function expectMaps(expression: string, to: string): void {
	expect(toECMAScript(expression, true)).toEqual(to);
}
function get(expression: string | number): string {
	return typeof expression === "number"
		? String.fromCodePoint(expression)
		: <string>expression;
}
