import { rangesOverlap, sign, termsOverlap } from "./conflictsService";

describe("Conflicts Service", () => {
  describe("sign function", () => {
    const testCases = [
      { in: -2, out: -1 },
      { in: 3, out: 1 },
      { in: 0, out: 0 },
    ];

    testCases.forEach((testCase) => {
      test(`returns ${testCase.out} for input ${testCase.in}`, () => {
        expect(sign(testCase.in)).toBe(testCase.out);
      });
    });
  });

  describe("rangesOverlap", () => {
    const testCases = [
      { a: [1, 5], b: [3, 7], out: true },
      { a: [1, 3], b: [5, 7], out: false },
      { a: [1, 4], b: [4, 7], out: true },
    ];

    testCases.forEach((testCase) => {
      test(`correctly determines overlap between [${testCase.a.join(", ")}] and [${testCase.b.join(", ")}]`, () => {
        expect(rangesOverlap(testCase.a, testCase.b)).toBe(testCase.out);
        expect(rangesOverlap(testCase.b, testCase.a)).toBe(testCase.out);
      });
    });
  });

  describe("termsOverlap", () => {
    const testCases = [
      { a: "Full", b_list: ["First", "Second", "A", "B", "C", "D"], out: true },
      { a: "First", b_list: ["Full", "A", "B"], out: true },
      { a: "Second", b_list: ["Full", "C", "D"], out: true },
      { a: "First", b_list: ["Second", "C", "D"], out: false },
      { a: "Second", b_list: ["First", "A", "B"], out: false },
    ];

    testCases.forEach((testCase) => {
      testCase.b_list.forEach((b) => {
        test(`correctly checks conflict between "${testCase.a}" and "${b}"`, () => {
          expect(termsOverlap(testCase.a, b)).toBe(testCase.out);
          expect(termsOverlap(b, testCase.a)).toBe(testCase.out);
        });
      });
    });
  });
});
