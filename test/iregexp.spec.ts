import { ensureExpression } from '../src';

describe('invalid expression', () => {
  it('should report error', () => {
    try {
		  ensureExpression('[?');
    }
    catch (err) {
      expect(err).toBeInstanceOf(Error);
      if (err instanceof(Error)) {
        expect(err.message).toMatch(/offset/);
      }
    }
  });
});
