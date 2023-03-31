import { check } from '../src';

describe('iregexp atoms normal chars', () => {
  it('%x00-27', () => {
    pass('\u0000');
    pass('\u0001');
    pass('\u0002');
    pass('\u0003');
    pass('\u0004');
    pass('\u0005');
    pass('\u0006');
    pass('\u0007');
    pass('\u0008');
    pass('\u0009');
    pass('\u000a');
    pass('\u000b');
    pass('\u000c');
    pass('\u000d');
    pass('\u000e');
    pass('\u000f');
    pass('\u0010');
    pass('\u0011');
    pass('\u0012');
    pass('\u0013');
    pass('\u0014');
    pass('\u0015');
    pass('\u0016');
    pass('\u0017');
    pass('\u0018');
    pass('\u0019');
    pass('\u001a');
    pass('\u001b');
    pass('\u001c');
    pass('\u001d');
    pass('\u001e');
    pass('\u001f');
    pass('\u0020');
    pass('\u0021');
    pass('\u0022');
    pass('\u0023');
    pass('\u0024');
    pass('\u0025');
    pass('\u0026');
    pass('\u0027');
  });
  it('%x2F-3E', () => {
    pass('\u002f');
    pass('\u0030');
    pass('\u0031');
    pass('\u0032');
    pass('\u0033');
    pass('\u0034');
    pass('\u0035');
    pass('\u0036');
    pass('\u0037');
    pass('\u0038');
    pass('\u0039');
    pass('\u003a');
    pass('\u003b');
    pass('\u003c');
    pass('\u003d');
    pass('\u003e');
  });
  it('%x40-5A', () => {
    pass('\u0040');
    pass('\u0041');
    pass('\u0042');
    pass('\u0043');
    pass('\u0044');
    pass('\u0045');
    pass('\u0046');
    pass('\u0047');
    pass('\u0048');
    pass('\u0049');
    pass('\u004a');
    pass('\u004b');
    pass('\u004c');
    pass('\u004d');
    pass('\u004e');
    pass('\u004f');
    pass('\u0050');
    pass('\u0051');
    pass('\u0052');
    pass('\u0053');
    pass('\u0054');
    pass('\u0055');
    pass('\u0056');
    pass('\u0057');
    pass('\u0058');
    pass('\u0059');
    pass('\u005a');
  });
  it('%x5E-7A', () => {
    pass('\u005e');
    pass('\u005f');
    pass('\u0060');
    pass('\u0061');
    pass('\u0062');
    pass('\u0063');
    pass('\u0064');
    pass('\u0065');
    pass('\u0066');
    pass('\u0067');
    pass('\u0068');
    pass('\u0069');
    pass('\u006a');
    pass('\u006b');
    pass('\u006c');
    pass('\u006d');
    pass('\u006e');
    pass('\u006f');
    pass('\u0070');
    pass('\u0071');
    pass('\u0072');
    pass('\u0073');
    pass('\u0074');
    pass('\u0075');
    pass('\u0076');
    pass('\u0077');
    pass('\u0078');
    pass('\u0079');
    pass('\u007a');
  });
  it('%x7E-10FFF', () => {
    pass('\u007e');
    pass('\u007f');
    pass('\u0080');
    pass('\u0081');
    // ...
  });
});

describe('iregexp parens atoms', () => {
  it('parens', () => {
    pass('(a)');
    pass('(a)+');
    pass('(a){2}');
    pass('(a){2,3}');
  });
  it('should fail on mismatched parens', () => {
    fail('(');
    fail(')');
    fail('(a');
    fail('a)');
  });
});

describe('iregexp atoms', () => {
  it('sequence', () => {
    pass('a(a)a');
  });
});

describe('iregexp quantifiers', () => {
  it('quantifier', () => {
    pass('a*');
    pass('a+');
    pass('a?');
  });
  it('quantity', () => {
    pass('a{2}');
    pass('a{2,3}');
  });
  it('should fail on invalid quantifiers', () => {
    fail('*');
    fail('+');
    fail('?');
    fail('a**');
    fail('a++');
    fail('a??');
  });
  it('should fail on invalid quantity', () => {
    fail('{');
    fail('}');
    fail('{}');
    fail('{,}');
    fail('{4,}');
    fail('{,2}');
    fail('a{');
    fail('a}');
    fail('a{}');
    fail('a{,}');
    fail('a{4,}');
    fail('a{,2}');
  });
});

function pass(expression: string): void {
  expect(check(expression)).toEqual(true);
}
function fail(expression: string): void {
	let succeeded = false;
	try{
		succeeded = check(expression);
	}
	catch(e){
		expect(e).toBeInstanceOf(Error);
	}

	if (succeeded){
		throw new Error(`the expression ${expression} was incorrectly considered a valid regular expression.`);
	}
}
