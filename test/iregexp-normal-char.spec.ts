import { fail, pass } from "./utils";

describe("NormalChar", () => {
	it("%x00-27", () => {
		pass("\u0000");
		pass("\u0001");
		pass("\u0002");
		pass("\u0003");
		pass("\u0004");
		pass("\u0005");
		pass("\u0006");
		pass("\u0007");
		pass("\u0008");
		pass("\u0009");
		pass("\u000a");
		pass("\u000b");
		pass("\u000c");
		pass("\u000d");
		pass("\u000e");
		pass("\u000f");
		pass("\u0010");
		pass("\u0011");
		pass("\u0012");
		pass("\u0013");
		pass("\u0014");
		pass("\u0015");
		pass("\u0016");
		pass("\u0017");
		pass("\u0018");
		pass("\u0019");
		pass("\u001a");
		pass("\u001b");
		pass("\u001c");
		pass("\u001d");
		pass("\u001e");
		pass("\u001f");
		pass("\u0020");
		pass("\u0021");
		pass("\u0022");
		pass("\u0023");
		pass("\u0024");
		pass("\u0025");
		pass("\u0026");
		pass("\u0027");
	});
	it("%x2F-3E", () => {
		pass("\u002f");
		pass("\u0030");
		pass("\u0031");
		pass("\u0032");
		pass("\u0033");
		pass("\u0034");
		pass("\u0035");
		pass("\u0036");
		pass("\u0037");
		pass("\u0038");
		pass("\u0039");
		pass("\u003a");
		pass("\u003b");
		pass("\u003c");
		pass("\u003d");
		pass("\u003e");
	});
	it("%x40-5A", () => {
		pass("\u0040");
		pass("\u0041");
		pass("\u0042");
		pass("\u0043");
		pass("\u0044");
		pass("\u0045");
		pass("\u0046");
		pass("\u0047");
		pass("\u0048");
		pass("\u0049");
		pass("\u004a");
		pass("\u004b");
		pass("\u004c");
		pass("\u004d");
		pass("\u004e");
		pass("\u004f");
		pass("\u0050");
		pass("\u0051");
		pass("\u0052");
		pass("\u0053");
		pass("\u0054");
		pass("\u0055");
		pass("\u0056");
		pass("\u0057");
		pass("\u0058");
		pass("\u0059");
		pass("\u005a");
	});
	it("%x5E-7A", () => {
		pass("\u005e");
		pass("\u005f");
		pass("\u0060");
		pass("\u0061");
		pass("\u0062");
		pass("\u0063");
		pass("\u0064");
		pass("\u0065");
		pass("\u0066");
		pass("\u0067");
		pass("\u0068");
		pass("\u0069");
		pass("\u006a");
		pass("\u006b");
		pass("\u006c");
		pass("\u006d");
		pass("\u006e");
		pass("\u006f");
		pass("\u0070");
		pass("\u0071");
		pass("\u0072");
		pass("\u0073");
		pass("\u0074");
		pass("\u0075");
		pass("\u0076");
		pass("\u0077");
		pass("\u0078");
		pass("\u0079");
		pass("\u007a");
	});
	it("%x7E-D7FF", () => {
		for (let c = 0x7e; c <= 0xd7ff; c++) {
			pass(c);
		}
	});
	it("%xD800-DFFF - invalid surrogate codepoints", () => {
		for (let c = 0xd800; c <= 0xdfff; c++) {
			fail(c);
		}
	});
	it("%xE000-10FFF", () => {
		for (let c = 0xe000; c <= 0x10fff; c++) {
			pass(c);
		}
	});
	it("miscellaneous", () => {
		pass(",");
		pass("-");
	});
});
