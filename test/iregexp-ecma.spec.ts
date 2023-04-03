import { toECMAScript } from '../src';

describe('mapping iregexp to ECMAScript RegExp', () => {
	it('should map iregexp to ECMAScript RegExp', () => {
		expect(toECMAScript('a')).toEqual('a');
		expect(toECMAScript('a', false)).toEqual('a');
		expect(toECMAScript('a', true)).toEqual('^(?:a)$');
	});
	it('should map iregexp to ECMAScript RegExp (anchored)', () => {
		expectMaps('a', '^(?:a)$');
		expectMaps('\\.', '^(?:\\.)$');
		expectMaps('\\.\\\\.', '^(?:\\.\\\\[^\\n\\r])$');
		expectMaps('.*', '^(?:[^\\n\\r]*)$');
		expectMaps('[a-z.+]', '^(?:[a-z.+])$');
	});
});

export function expectMaps(expression: string, to: string): void {
  expect(toECMAScript(expression, true)).toEqual(to);
}