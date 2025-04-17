import { readFileSync } from "fs";
import { join } from "path";
import { Course, Day, Schedule, Section, SemesterLength, Term } from "../interfaces/dataInterfaces";
import { csvStringToSchedule } from "./readCSV";
import { scheduleToFullCSVString } from "./writeFullCSV";
import { scheduleToCSVString } from "./writeLoadsCSV";

let schedule: Schedule;
let basicCourse: Course;
let basicSection: Section;
let noMeetingSection: Section;
let multipleInstructorSection: Section;
let interimSection: Section;
let firstHalfSection: Section;
let fullOutputCSV: string;
let outputCSV: string;
let intermediateSchedule: Schedule;
let secondFullOutputCSV: string;
let expectedFullOutputCSV: string;
let expectedOutputCSV: string;

beforeAll(async () => {
  // File read from https://stackoverflow.com/questions/32705219/nodejs-accessing-file-with-relative-path
  const fullCSVString: string = readFileSync(
    join(__dirname, "..", "..", "..", "csv", "Course_Section_Enrollment_Report-CS-DS-2023.csv"),
    "utf8",
  );
  expectedFullOutputCSV = readFileSync(
    join(__dirname, "..", "..", "..", "csv", "Course_Section_Enrollment_Report-CS-DS-2023_Output.csv"),
    "utf8",
  );
  // expectedOutputCSV = readFileSync(
  //   join(__dirname, "..", "..", "..", "csv", "math-schedule-export.csv"),
  //   "utf8",
  // );
  schedule = csvStringToSchedule(fullCSVString);
  [basicCourse] = schedule.courses;
  [basicSection] = basicCourse.sections;
  [noMeetingSection] = schedule.courses[40].sections;
  [multipleInstructorSection] = schedule.courses[19].sections;
  // [interimSection] = schedule.courses[3].sections;
  [firstHalfSection] = schedule.courses[1].sections;
  fullOutputCSV = scheduleToFullCSVString(schedule);
  intermediateSchedule = csvStringToSchedule(fullOutputCSV);
  secondFullOutputCSV = scheduleToFullCSVString(intermediateSchedule);
  // outputCSV = scheduleToCSVString(schedule);
});

// TODO: add section to test file with second half semester length and Intensive B-D

it("loads csv to Schedule object", () => {
  expect(schedule).toBeDefined();
});

// The number of courses (NOT SECTIONS) in the schedule.
it("loads all courses", () => {
  expect(schedule.courses.length).toEqual(41);
});

// Check the information of the first course.
describe("parses basic course", () => {
  it("loads course", () => {
    expect(basicCourse).toBeDefined();
  });

  it("parses department", () => {
    expect(basicCourse.department).toEqual("CS");
  });

  it("parses name", () => {
    expect(basicCourse.name).toEqual(" Creating Interactive Web Media");
  });

  it("parses number", () => {
    expect(basicCourse.number).toEqual("100");
  });

  it("parses prefixes", () => {
    expect(basicCourse.prefixes.length).toEqual(1);
    expect(basicCourse.prefixes[0]).toEqual("CS");
  });

  it("parses sections", () => {
    expect(basicCourse.sections.length).toEqual(1);
  });
});

// Check the information of the sections of the first course.
// The first course only has one section.
describe("parses basic section", () => {
  it("loads section", () => {
    expect(basicSection).toBeDefined();
  });

  it("parses faculty hours", () => {
    expect(basicSection.facultyHours).toEqual(4);
  });

  it("parses student hours", () => {
    expect(basicSection.studentHours).toEqual(4);
  });

  // it("parses used", () => {
  //   expect(basicSection.used).toEqual(32);
  // });

  // it("parses day 10 used", () => {
  //   expect(basicSection.day10Used).toEqual(undefined);
  // });

  // it("parses term start", () => {
  //   expect(basicSection.termStart).toEqual("8/28/2023");
  // });

  it("parses start date", () => {
    expect(basicSection.startDate).toEqual("2023/8/28");
  });

  it("parses end date", () => {
    expect(basicSection.endDate).toEqual("2023/12/16");
  });

  it("parses status", () => {
    expect(basicSection.status).toEqual("Open");
  });

  it("parses instructional method", () => {
    expect(basicSection.instructionalMethod).toEqual("Lecture");
  });

  // it("parses global max", () => {
  //   expect(basicSection.globalMax).toEqual(32);
  // });

  // it("parses local max", () => {
  //   expect(basicSection.localMax).toEqual(32);
  // });

  it("parses letter", () => {
    expect(basicSection.letter).toEqual("A ");
  });

  it("parses term", () => {
    expect(basicSection.term).toEqual(Term.Fall);
  });

  // it("parses year", () => {
  //   expect(basicSection.year).toEqual(2023);
  // });

  it("parses instructors", () => {
    expect(basicSection.instructors.length).toEqual(1);
    expect(basicSection.instructors[0]).toEqual("David Meyer");
  });

  it("parses meetings", () => {
    expect(basicSection.meetings.length).toEqual(1);
  });

  it("parses days", () => {
    expect(basicSection.meetings[0].days.length).toEqual(2);
    expect(basicSection.meetings[0].days).toEqual([Day.Tuesday, Day.Thursday]);
  });

  it("parses location", () => {
    expect(basicSection.meetings[0].location.building).toEqual("Science Building");
    expect(basicSection.meetings[0].location.roomNumber).toEqual("372");
  });

  it("parses time", () => {
    expect(basicSection.meetings[0].startTime).toEqual("10:20 AM");
    expect(basicSection.meetings[0].duration).toEqual(100);
  });

  it("parses semester length", () => {
    expect(basicSection.semesterLength).toEqual(SemesterLength.Full);
  });
});

// Check the information of a section with multiple instructors.
it("parses multiple instructors", () => {
  expect(multipleInstructorSection.instructors.length).toEqual(3);
  expect(multipleInstructorSection.instructors[0]).toEqual("Adam Vedra");
  expect(multipleInstructorSection.instructors[1]).toEqual("");
  expect(multipleInstructorSection.instructors[2]).toEqual("Brian Paige");
});

// Check the information of a interim section.
// CURRENTLY NOT IN USE BECAUSE WE DON'T HAVE INTERIM COURSE.
// describe("parses interim section", () => {
//   it("parses term", () => {
//     expect(interimSection.term).toEqual(Term.Interim);
//   });

//   it("parses days", () => {
//     expect(interimSection.meetings[0].days.length).toEqual(5);
//     expect(interimSection.meetings[0].days).toEqual([
//       Day.Monday,
//       Day.Tuesday,
//       Day.Wednesday,
//       Day.Thursday,
//       Day.Friday,
//     ]);
//   });

//   it("parses time", () => {
//     expect(interimSection.meetings[0].startTime).toEqual("8:30 AM");
//     expect(interimSection.meetings[0].duration).toEqual(510);
//   });

//   it("parses semester length", () => {
//     expect(interimSection.semesterLength).toEqual(SemesterLength.IntensiveA);
//   });
// });

it("handles sections with no meeting time", () => {
  expect(noMeetingSection.meetings.length).toEqual(0);
});

it("parses first half semester length", () => {
  expect(firstHalfSection.semesterLength).toEqual(SemesterLength.HalfFirst);
});

// TODO: fix this test to work with the added sorting feature
// it("exports the proper csv", () => {
//   expect(outputCSV).toEqual(expectedOutputCSV);
// });

// TODO: fix this test to work with the added sorting feature
// it("exports the proper full csv", () => {
//   expect(fullOutputCSV).toEqual(expectedFullOutputCSV);
// });

// TODO: fix this test to work with the added sorting feature
// it("reimports the full export with same structure", () => {
//   expect(intermediateSchedule).toEqual(schedule);
// });

// TODO: fix this test to work with the added sorting feature
// it("preserves information on second full export", () => {
//   expect(secondFullOutputCSV).toEqual(expectedFullOutputCSV);
// });
