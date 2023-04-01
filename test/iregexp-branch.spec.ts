import { pass, fail } from './utils';

describe('iregexp branches', () => {
  it('branch', () => {
    pass('a|b');
    pass('a|b');
  });
  it('should fail on incomplete branch', () => {
    fail('|');
    fail('a|');
    fail('||');
    fail('|?');
  });
});
