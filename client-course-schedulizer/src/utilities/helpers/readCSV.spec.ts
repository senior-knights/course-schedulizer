import fetch from "isomorphic-fetch";
import { csvStringToSchedule } from "./readCSV";
import { Course, Day, Schedule, Section, SemesterLength, Term } from "../interfaces/dataInterfaces";

let schedule: Schedule;
let basicCourse: Course;
let basicSection: Section;
let noMeetingSection: Section;
let multipleInstructorSection: Section;
let interimSection: Section;
let firstHalfSection: Section;

beforeAll(async () => {
  const csv = await fetch(
    "https://raw.githubusercontent.com/senior-knights/course-schedulizer/develop/client-course-schedulizer/public/math-schedule.csv",
  );
  const csvString: string = await csv.text();
  schedule = csvStringToSchedule(csvString);
  [basicCourse] = schedule.courses;
  [basicSection, noMeetingSection] = basicCourse.sections;
  [multipleInstructorSection] = schedule.courses[6].sections;
  [interimSection] = schedule.courses[3].sections;
  [firstHalfSection] = schedule.courses[13].sections;
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

  it("parses anticipated size", () => {
    expect(basicSection.anticipatedSize).toEqual(32);
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
    expect(basicSection.meetings[0].startTime).toEqual("12:30PM");
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
    expect(interimSection.meetings[0].startTime).toEqual("8:30AM");
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
