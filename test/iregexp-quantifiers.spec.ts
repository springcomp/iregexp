import { pass, fail } from './utils';

describe('iregexp quantifiers', () => {
  it('quantifier', () => {
    pass('a*');
    pass('a+');
    pass('a?');
  });
  it('quantity', () => {
    pass('a{2}');
    pass('a{2,3}');
  });
  it('should fail on invalid quantifiers', () => {
    fail('*');
    fail('+');
    fail('?');
    fail('a**');
    fail('a++');
    fail('a??');
  });
  it('should fail on invalid quantity', () => {
    fail('{');
    fail('}');
    fail('{}');
    fail('{,}');
    fail('{4,}');
    fail('{,2}');
    fail('a{');
    fail('a}');
    fail('a{}');
    fail('a{,}');
    fail('a{4,}');
    fail('a{,2}');
  });
});