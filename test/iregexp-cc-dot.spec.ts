import { pass } from './utils';

describe('dot', () => {
  it('.', () => {
    pass('.');
    pass('..');
    pass('.*');
    pass('.?');
  });
});
