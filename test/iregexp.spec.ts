import { ensureExpression } from '../src';

describe('invalid expression', () => {
  it('should report error', () => {
		const [ok, err] = ensureExpression('[?');
    expect(ok).toEqual(false);
    expect(err).toBeInstanceOf(Error);
    if (err instanceof(Error)) {
      expect(err.message).toMatch(/offset/);
    }
  });
});
