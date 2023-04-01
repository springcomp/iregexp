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
    fail('\\p{Ln}');
    fail('\\p{Lp}');
    fail('\\p{Lq}');
    fail('\\p{Lr}');
    fail('\\p{Ls}');
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
