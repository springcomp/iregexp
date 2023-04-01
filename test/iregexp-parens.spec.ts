import { pass, fail } from './utils';

describe('iregexp parens atoms', () => {
  it('parens', () => {
    pass('(a)');
    pass('(a)+');
    pass('(a){2}');
    pass('(a){2,3}');
  });
  it('sequence', () => {
    pass('a(a)a');
  });
  it('should fail on mismatched parens', () => {
    fail('(');
    fail(')');
    fail('(a');
    fail('a)');
  });
});
