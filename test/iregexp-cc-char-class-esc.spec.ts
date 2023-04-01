import { pass, fail } from './utils';

describe('charClassEsc', () => {
  it('\\p{C} Others', () => {
    pass('\\p{C}');
    pass('\\p{Cc}');
    pass('\\p{Cf}');
    pass('\\p{Cn}');
    pass('\\p{Co}');
  });
  it('should fail on invalid C character class', () => {
    fail('\\p{Cx}');
  });
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
  it('should fail on invalid M character class', () => {
    fail('\\p{Mx}');
  });
  it('\\p{N} Numbers', () => {
    pass('\\p{N}');
    pass('\\p{Nd}');
    pass('\\p{Nl}');
    pass('\\p{No}');
  });
  it('should fail on invalid N character class', () => {
    fail('\\p{Nx}');
  });
  it('\\p{P} Punctation', () => {
    pass('\\p{P}');
    pass('\\p{Pc}');
    pass('\\p{Pd}');
    pass('\\p{Pe}');
    pass('\\p{Pf}');
    pass('\\p{Pi}');
    pass('\\p{Po}');
    pass('\\p{Ps}');
  });
  it('should fail on invalid P character class', () => {
    fail('\\p{Px}');
  });
  it('\\p{Z} Separators', () => {
    pass('\\p{Z}');
    pass('\\p{Zl}');
    pass('\\p{Zp}');
    pass('\\p{Zs}');
  });
  it('should fail on invalid Z character class', () => {
    fail('\\p{Zx}');
  });
  it('\\p{S} Symbols', () => {
    pass('\\p{S}');
    pass('\\p{Sc}');
    pass('\\p{Sk}');
    pass('\\p{Sm}');
    pass('\\p{So}');
  });
  it('should fail on invalid S character class', () => {
    fail('\\p{Sx}');
  });
  it('\\p{Is} IsBlock', () => {
    pass('\\p{IsAlpha}');
    pass('\\p{IsLatin}');
  });
  it('\\p{Is} IsBlock syntax', () => {
    pass('\\p{Is-0123-abcd-456-ABCD-789-EFGH-}');
  });
  it('should fail on invalid Is block', () => {
    fail('\\p{Is}');
  });
  it('should allow character class in range', () => {
    pass('[\\p{L}]');
    pass('[\\p{M}]');
    pass('[\\p{Lo}\\p{Me}]');
  });
  it('should fail on invalid character properties', () => {
    fail('\\p');
    fail('\\p{');
    fail('\\p{}');
  });
});

describe('charClassEsc singleCharEsc', () => {
  it('%x28-2B', () => {
    pass('[\\(]');
    pass('[\\)]');
    pass('[\\*]');
    pass('[\\+]');
  });
  it('%x2D-2E', () => {
    pass('[\\-]');
    pass('[\\.]');
  });
  it('?', () => {
    pass('[\\?]');
  });
  it('%x5B-5E', () => {
    pass('[\\?]');

    pass('[\\[]');
    pass('[\\\\]');
    pass('[\\]]');
    pass('[\\^]');
  });
  it('n r t', () => {
    pass('[\\n]');
    pass('[\\r]');
    pass('[\\t]');
  });
  it('%x7B-7D', () => {
    pass('[\\{]');
    pass('[\\|]');
    pass('[\\}]');
  });
  it('sequence', () => {
    pass('[\\(\\*\\+\\)]');
    pass('[\\(\\-\\.\\)]');
    pass('[\\(\\?\\)]');
    pass('[\\n\\r\\t]');
  });
  it('should fail on invalid escape', () => {
    fail('[\\a]');
    fail('[\\0]');
    fail('[\\,]');
  });
});