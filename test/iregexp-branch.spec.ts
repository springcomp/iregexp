import { pass, fail } from './utils';

describe('iregexp branches', () => {
  it('branch', () => {
    pass('a|b');
    pass('a|b');
    pass('a|');
  });
  it('should fail on incomplete branch', () => {
    fail('|');
    fail('||');
    fail('|?');
  });
});
