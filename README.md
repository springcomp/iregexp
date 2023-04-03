# I-Regexp Checker

IRegexpChecker is pushdown automaton that very quickly determines if a
regular expression using a specified interoperable subset is
syntactically correct.

It supports the [I-Regexp](https://ietf-wg-jsonpath.github.io/iregexp/draft-ietf-jsonpath-iregexp.html) specification.

## Building

```sh
npm install && npx jest --coverage
```

## Usage

```js
import iregexp from '@springcomp/iregexp';

const regex = second as string;
try{
  iregexp.ensureExpression(regex);
}
catch (err) {
  ...
}
```

## Known limitations

This currently fails to check the following expressions as invalid:

- `` [z-a] ``: reversed range.
- `` a{9,3} ``:reversed min/max quantities.