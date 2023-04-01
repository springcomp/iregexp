import { pass } from './utils';

describe('iregexp parens atoms', () => {
  it('sequence', () => {
    pass('a(a)a');
  });
});
