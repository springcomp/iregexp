import { fail, pass } from "./utils";

describe("charClassExpr", () => {
	it("%x00-2C", () => {
		pass("[^-\u0000]");
		pass("[^-\u0001]");
		pass("[^-\u0002]");
		pass("[^-\u0003]");
		pass("[^-\u0004]");
		pass("[^-\u0005]");
		pass("[^-\u0006]");
		pass("[^-\u0007]");
		pass("[^-\u0008]");
		pass("[^-\u0009]");
		pass("[^-\u000a]");
		pass("[^-\u000b]");
		pass("[^-\u000c]");
		pass("[^-\u000d]");
		pass("[^-\u000e]");
		pass("[^-\u000f]");
		pass("[^-\u0010]");
		pass("[^-\u0011]");
		pass("[^-\u0012]");
		pass("[^-\u0013]");
		pass("[^-\u0014]");
		pass("[^-\u0015]");
		pass("[^-\u0016]");
		pass("[^-\u0017]");
		pass("[^-\u0018]");
		pass("[^-\u0019]");
		pass("[^-\u001a]");
		pass("[^-\u001b]");
		pass("[^-\u001c]");
		pass("[^-\u001d]");
		pass("[^-\u001e]");
		pass("[^-\u001f]");
		pass("[^-\u0020]");
		pass("[^-\u0021]");
		pass("[^-\u0022]");
		pass("[^-\u0023]");
		pass("[^-\u0024]");
		pass("[^-\u0025]");
		pass("[^-\u0026]");
		pass("[^-\u0027]");
		pass("[^-\u0028]");
		pass("[^-\u0029]");
		pass("[^-\u002a]");
		pass("[^-\u002b]");
		pass("[^-\u002c]");
	});
	it("%x2E-5A", () => {
		pass("[^-\u002e]");
		pass("[^-\u002f]");
		pass("[^-\u0030]");
		pass("[^-\u0031]");
		pass("[^-\u0032]");
		pass("[^-\u0033]");
		pass("[^-\u0034]");
		pass("[^-\u0035]");
		pass("[^-\u0036]");
		pass("[^-\u0037]");
		pass("[^-\u0038]");
		pass("[^-\u0039]");
		pass("[^-\u003a]");
		pass("[^-\u003b]");
		pass("[^-\u003c]");
		pass("[^-\u003d]");
		pass("[^-\u003e]");
		pass("[^-\u003f]");
		pass("[^-\u0040]");
		pass("[^-\u0041]");
		pass("[^-\u0042]");
		pass("[^-\u0043]");
		pass("[^-\u0044]");
		pass("[^-\u0045]");
		pass("[^-\u0046]");
		pass("[^-\u0047]");
		pass("[^-\u0048]");
		pass("[^-\u0049]");
		pass("[^-\u004a]");
		pass("[^-\u004b]");
		pass("[^-\u004c]");
		pass("[^-\u004d]");
		pass("[^-\u004e]");
		pass("[^-\u004f]");
		pass("[^-\u0050]");
		pass("[^-\u0051]");
		pass("[^-\u0052]");
		pass("[^-\u0053]");
		pass("[^-\u0054]");
		pass("[^-\u0055]");
		pass("[^-\u0056]");
		pass("[^-\u0057]");
		pass("[^-\u0058]");
		pass("[^-\u0059]");
		pass("[^-\u005a]");
	});
	it("%x5E-D7FF", () => {
		for (let ch = 0x5e; ch <= 0xd7ff; ch++) {
			const expression = `[^-${String.fromCodePoint(ch)}]`;
			pass(expression);
		}
	});
	it("%xD800-DFFF - invalid surrogate code points", () => {
		for (let ch = 0xd800; ch <= 0xdfff; ch++) {
			const expression = `[^-${String.fromCodePoint(ch)}]`;
			fail(expression);
		}
	});
	it("%xE000-10FFF", () => {
		for (let ch = 0xe000; ch <= 0x10fff; ch++) {
			const expression = `[^-${String.fromCodePoint(ch)}]`;
			pass(expression);
		}
	});
	it("negative ^ assertion", () => {
		pass("[a]");
		pass("[a^a]");
		pass("[^a^]");
		pass("[^^a^]");
		pass("[^a^a]");
	});
	it("leading or trailing - character", () => {
		pass("[-a]");
		pass("[a-]");
		pass("[-a-]");
		pass("[-a-b]");
		pass("[-a-bc-]");
	});
	it("escape", () => {
		pass("[\\r\\n\\t]");
		pass("[^\\r\\n\\t]");
		pass("[^\\r-\\n\\t-]");
	});
	it("range", () => {
		pass("[^-a]");
		pass("[^a-]");
		pass("[^-a-]");
		pass("[^-a-b]");
		pass("[^-^-^]");
	});
	it("should fail on invalid bracket", () => {
		fail("[");
		fail("]");
		fail("[^]");
		fail("[--]");
		fail("[a--b]");
		fail("[a-z-A-Z]");
	});
	// TODO
	//it('should fail on incorrect range', () => {
	//  fail('[z-a]');
	//});
});
