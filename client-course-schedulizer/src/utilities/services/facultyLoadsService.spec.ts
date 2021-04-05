import { loadHoursRegEx } from "./facultyLoadsService";

// Test the variety of course/duty specification types to ensure that the
// loadHoursRegEx removes exactly the faculty hour specifications.
[
  // These should all work fine.
  { in: "Duty-1 (7), CS-195-A (0.5)", out: "Duty-1, CS-195-A" },
  { in: "Duty-1 (7)", out: "Duty-1" },
  { in: "Duty 2  (0.111)", out: "Duty 2 " }, // only removes one space
  { in: "Duty (2) (0.111)", out: "Duty (2)" },
  {
    in:
      "CS-104-A (1), CS-104-B (1), CS-104-C (1), CS-104L-A (1), CS-104L-B (1), CS-104L-C (1), CS-104L-D (1), CS-195-A (0.5), CS-295-A (0.5), CS-396-A (0.25)",
    out:
      "CS-104-A, CS-104-B, CS-104-C, CS-104L-A, CS-104L-B, CS-104L-C, CS-104L-D, CS-195-A, CS-295-A, CS-396-A",
  },

  // This would fail; your duty name can't have "(3)," in it.
  // {in: "Duty (3), (0.111)", out: "Duty (3),"},
].forEach((test_case) => {
  test("should parse out the faculty hour specs", () => {
    expect(test_case.in.split(loadHoursRegEx).join("")).toBe(test_case.out);
  });
});
