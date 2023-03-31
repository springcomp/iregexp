import { check } from "../src";

describe("iregexp", () => {
  it("should parse", () => {
    expect(check(".")).toEqual(true);
  });
});
