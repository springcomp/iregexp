import { pass, fail } from './utils';

describe('charClassEsc', () => {
  it('\\p{L} Letters', () => {
    pass('\\p{L}');
    pass('\\p{Ll}');
    pass('\\p{Lm}');
    pass('\\p{Lo}');
    pass('\\p{Lt}');
    pass('\\p{Lu}');
  });
  it('should fail on invalid L character class', () => {
    fail('\\p{Lx}');
  });
  it('\\p{M} Marks', () => {
    pass('\\p{M}');
    pass('\\p{Mc}');
    pass('\\p{Me}');
    pass('\\p{Mn}');
  });
  it('should fail on invalid L character class', () => {
    fail('\\p{Mx}');
  });
  //it('\\p{Is} IsBlock', () => {
  //  pass('\\p{}');
  //});
  it('should fail on invalid character properties', () => {
    fail('\\p');
    fail('\\p{');
    fail('\\p{}');
  });
});
