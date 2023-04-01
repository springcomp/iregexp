import { pass, fail } from './utils';

describe('iregexp character class bracket', () => {
  it('negative ^ assertion', () => {
    pass('[a]');
    pass('[a^a]');
    pass('[^a^]');
    pass('[^^a^]');
    pass('[^a^a]');
  });
  it('leading or trailing - character', () => {
    pass('[-a]');
    pass('[a-]');
    pass('[-a-]');
    pass('[-a-b]');
    pass('[-a-bc-]');
  });
  it('escape', () => {
    pass('[\\r\\n\\t]');
    pass('[^\\r\\n\\t]');
    pass('[^\\r-\\n\\t-]');
  });
  it('range', () => {
    pass('[^-a]');
    pass('[^a-]');
    pass('[^-a-]');
    pass('[^-a-b]');
    pass('[^-^-^]');
  });
  it('should fail on invalid bracket', () => {
    fail('[');
    fail(']');
    fail('[^]');
    fail('[--]');
    fail('[a--b]');
    fail('[a-z-A-Z]');
  });
});
