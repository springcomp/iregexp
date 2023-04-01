import { pass, fail } from './utils';

describe('iregexp character class single char esc', () => {
  it('%x28-2B', () => {
    pass('\\(');
    pass('\\)');
    pass('\\*');
    pass('\\+');
  });
  it('%x2D-2E', () => {
    pass('\\-');
    pass('\\.');
  });
  it('?', () => {
    pass('\\?');
  });
  it('%x5B-5E', () => {
    pass('\\?');

    pass('\\[');
    pass('\\\\');
    pass('\\]');
    pass('\\^');
  });
  it('n r t', () => {
    pass('\\n');
    pass('\\r');
    pass('\\t');
  });
  it('%x7B-7D', () => {
    pass('\\{');
    pass('\\|');
    pass('\\}');
  });
  it('sequence', () => {
    pass('\\(\\*\\+\\)');
    pass('\\(\\-\\.\\)');
    pass('\\(\\?\\)');
    pass('\\n\\r\\t');
  });
  it('should fail on invalid escape', () => {
    fail('\\a');
    fail('\\0');
    fail('\\,');
  });
});
