import { readFileSync } from "fs";
import { join } from "path";
import { Course, Day, Schedule, Section, SemesterLength, Term } from "../interfaces/dataInterfaces";
import { csvStringToSchedule } from "./readCSV";
import { scheduleToCSVString } from "./writeCSV";
import { scheduleToFullCSVString } from "./writeFullCSV";

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
    join(__dirname, "..", "..", "..", "csv", "math-schedule-full.csv"),
    "utf8",
  );
  expectedFullOutputCSV = readFileSync(
    join(__dirname, "..", "..", "..", "csv", "math-schedule-full-export.csv"),
    "utf8",
  );
  expectedOutputCSV = readFileSync(
    join(__dirname, "..", "..", "..", "csv", "math-schedule-export.csv"),
    "utf8",
  );
  schedule = csvStringToSchedule(fullCSVString);
  [basicCourse] = schedule.courses;
  [basicSection, noMeetingSection] = basicCourse.sections;
  [multipleInstructorSection] = schedule.courses[6].sections;
  [interimSection] = schedule.courses[3].sections;
  [firstHalfSection] = schedule.courses[13].sections;
  fullOutputCSV = scheduleToFullCSVString(schedule);
  intermediateSchedule = csvStringToSchedule(fullOutputCSV);
  secondFullOutputCSV = scheduleToFullCSVString(intermediateSchedule);
  outputCSV = scheduleToCSVString(schedule);
});

// TODO: add section to test file with second half semester length and Intensive B-D

it("loads csv to Schedule object", () => {
  expect(schedule).toBeDefined();
});

it("loads all courses", () => {
  expect(schedule.courses.length).toEqual(37);
});

describe("parses basic course", () => {
  it("loads course", () => {
    expect(basicCourse).toBeDefined();
  });

  it("parses department", () => {
    expect(basicCourse.department).toEqual("Mathematics and Statistics");
  });

  it("parses faculty hours", () => {
    expect(basicCourse.facultyHours).toEqual(3);
  });

  it("parses student hours", () => {
    expect(basicCourse.studentHours).toEqual(3);
  });

  it("parses name", () => {
    expect(basicCourse.name).toEqual("Math in the Contemporary World");
  });

  it("parses number", () => {
    expect(basicCourse.number).toEqual("100");
  });

  it("parses prefixes", () => {
    expect(basicCourse.prefixes.length).toEqual(1);
    expect(basicCourse.prefixes[0]).toEqual("MATH");
  });

  it("parses sections", () => {
    expect(basicCourse.sections.length).toEqual(2);
  });
});

describe("parses basic section", () => {
  it("loads section", () => {
    expect(basicSection).toBeDefined();
  });

  it("parses used", () => {
    expect(basicSection.used).toEqual(32);
  });

  it("parses day 10 used", () => {
    expect(basicSection.day10Used).toEqual(0);
  });

  it("parses term start", () => {
    expect(basicSection.termStart).toEqual("2/3/2020");
  });

  it("parses start date", () => {
    expect(basicSection.startDate).toEqual("2/3/2020");
  });

  it("parses end date", () => {
    expect(basicSection.endDate).toEqual("5/21/2020");
  });

  it("parses status", () => {
    expect(basicSection.status).toEqual("Active");
  });

  it("parses instructional method", () => {
    expect(basicSection.instructionalMethod).toEqual("LEC");
  });

  it("parses global max", () => {
    expect(basicSection.globalMax).toEqual(32);
  });

  it("parses local max", () => {
    expect(basicSection.localMax).toEqual(32);
  });

  it("parses letter", () => {
    expect(basicSection.letter).toEqual("A");
  });

  it("parses term", () => {
    expect(basicSection.term).toEqual(Term.Spring);
  });

  it("parses year", () => {
    expect(basicSection.year).toEqual(2019);
  });

  it("parses instructors", () => {
    expect(basicSection.instructors.length).toEqual(1);
    expect(basicSection.instructors[0]).toEqual("James Turner");
  });

  it("parses meetings", () => {
    expect(basicSection.meetings.length).toEqual(1);
  });

  it("parses days", () => {
    expect(basicSection.meetings[0].days.length).toEqual(3);
    expect(basicSection.meetings[0].days).toEqual([Day.Monday, Day.Wednesday, Day.Friday]);
  });

  it("parses location", () => {
    expect(basicSection.meetings[0].location.building).toEqual("NH");
    expect(basicSection.meetings[0].location.roomNumber).toEqual("251");
  });

  it("parses time", () => {
    expect(basicSection.meetings[0].startTime).toEqual("12:30 PM");
    expect(basicSection.meetings[0].duration).toEqual(50);
  });

  it("parses semester length", () => {
    expect(basicSection.semesterLength).toEqual(SemesterLength.Full);
  });
});

it("parses multiple instructors", () => {
  expect(multipleInstructorSection.instructors.length).toEqual(2);
  expect(multipleInstructorSection.instructors[0]).toEqual("Thomas L. Scofield");
  expect(multipleInstructorSection.instructors[1]).toEqual("Todd Kapitula");
});

describe("parses interim section", () => {
  it("parses term", () => {
    expect(interimSection.term).toEqual(Term.Interim);
  });

  it("parses days", () => {
    expect(interimSection.meetings[0].days.length).toEqual(5);
    expect(interimSection.meetings[0].days).toEqual([
      Day.Monday,
      Day.Tuesday,
      Day.Wednesday,
      Day.Thursday,
      Day.Friday,
    ]);
  });

  it("parses time", () => {
    expect(interimSection.meetings[0].startTime).toEqual("8:30 AM");
    expect(interimSection.meetings[0].duration).toEqual(510);
  });

  it("parses semester length", () => {
    expect(interimSection.semesterLength).toEqual(SemesterLength.IntensiveA);
  });
});

it("handles sections with no meeting time", () => {
  expect(noMeetingSection.meetings.length).toEqual(0);
});

it("parses first half semester length", () => {
  expect(firstHalfSection.semesterLength).toEqual(SemesterLength.HalfFirst);
});

it("exports the proper csv", () => {
  expect(outputCSV).toEqual(expectedOutputCSV);
});

it("exports the proper full csv", () => {
  expect(fullOutputCSV).toEqual(expectedFullOutputCSV);
});

it("reimports the full export with same structure", () => {
  expect(intermediateSchedule).toEqual(schedule);
});

it("preserves information on second full export", () => {
  expect(secondFullOutputCSV).toEqual(expectedFullOutputCSV);
});
