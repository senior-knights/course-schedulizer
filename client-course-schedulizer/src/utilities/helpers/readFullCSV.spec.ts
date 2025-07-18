import { readFileSync } from "fs";
import { join } from "path";
import { Course, Day, Schedule, Section, SemesterLength, Term } from "../interfaces/dataInterfaces";
import { csvStringToSchedule } from "./readCSV";
import { scheduleToFullCSVString } from "./writeFullCSV";

let schedule: Schedule;
let basicCourse: Course;
let basicSection: Section;
let noMeetingSection: Section;
let multipleInstructorSection: Section;
let firstHalfSection: Section;
let fullOutputCSV: string;
let intermediateSchedule: Schedule;
let secondFullOutputCSV: string;
let expectedFullOutputCSV: string;

beforeAll(async () => {
  // File read from https://stackoverflow.com/questions/32705219/nodejs-accessing-file-with-relative-path
  const fullCSVString: string = readFileSync(
    join(__dirname, "..", "..", "..", "data", "reports-CS2023-readtest.csv"),
    "utf8",
  );
  schedule = csvStringToSchedule(fullCSVString);
  [basicCourse] = schedule.courses;
  [basicSection] = basicCourse.sections;
  [noMeetingSection] = schedule.courses[40].sections;
  [multipleInstructorSection] = schedule.courses[19].sections;
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

  it("parses letter", () => {
    expect(basicSection.letter).toEqual("A ");
  });

  it("parses term", () => {
    expect(basicSection.term).toEqual(Term.Fall);
  });

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

it("handles sections with no meeting time", () => {
  expect(noMeetingSection.meetings.length).toEqual(0);
});

it("parses first half semester length", () => {
  expect(firstHalfSection.semesterLength).toEqual(SemesterLength.HalfFirst);
});
