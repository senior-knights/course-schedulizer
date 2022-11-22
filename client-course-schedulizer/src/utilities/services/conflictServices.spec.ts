import { sign, rangesOverlap, numericalSemLength, termsOverlap } from "./conflictsService";

[
    {in: -2, out: -1}, 
    {in: 3, out: 1}, 
    {in: 0, out: 0}
].forEach((test_case) => {
    test("sign function works correctly", () => {
        expect(sign(test_case.in)).toBe(test_case.out);
      });
});

[
    {a: [1, 5], b: [3, 7], out: true}, 
    {a: [1, 3], b: [5, 7], out: false}, 
    {a: [1, 4], b: [4, 7], out: true}
].forEach((test_case) => {
    test("rangesOverlap() works correctly", () => {
        expect(rangesOverlap(test_case.a, test_case.b)).toBe(test_case.out);
        expect(rangesOverlap(test_case.b, test_case.a)).toBe(test_case.out);
      });
});

[
    {a: 'Full', b_list: ['First', 'Second', 'A', 'B', 'C', 'D'], out: true}, 
    {a: 'First', b_list: ['Full', 'A', 'B'], out: true}, 
    {a: 'Second', b_list: ['Full', 'C', 'D'], out: true}, 
    {a: 'First', b_list: ['Second', 'C', 'D'], out: false}, 
    {a: 'Second', b_list: ['First', 'A', 'B'], out: false} 
].forEach((test_case) => {
    test_case.b_list.forEach( (b) => {
    test(`check for conflict between ${test_case.a} and ${b} is correct`, () => {
        expect(termsOverlap(test_case.a, b)).toBe(test_case.out);
        expect(termsOverlap(b, test_case.a)).toBe(test_case.out);
      });
    })
});
