import papa from "papaparse";
import { Course, Schedule, Section, SemesterLength, Term } from "../interfaces/dataInterfaces";
import * as cf from "./caseFunctions";

interface ValidFields {
  [key: string]: (value: string, data: cf.CaseCallbackParams) => void;
}

const pruimSpreadsheetFields: ValidFields = {
  anticipatedSize: cf.anticipatedSizeCallback,
  comments: cf.commentsCallback,
  days: cf.daysCallback,
  duration: cf.durationCallback,
  facultyHours: cf.facultyHoursCallback,
  globalMax: cf.globalMaxCallback,
  half: cf.semesterLengthCallback,
  instructor: cf.instructorCallback,
  instructors: cf.instructorCallback,
  localMax: cf.localMaxCallback,
  location: cf.locationCallback,
  name: cf.nameCallback,
  number: cf.numberCallback,
  prefix: cf.prefixCallback,
  prefixes: cf.prefixCallback,
  roomCapacity: cf.roomCapacityCallback,
  section: cf.letterCallback,
  semesterLength: cf.semesterLengthCallback,
  startTime: cf.startTimeCallback,
  startTimeStr: cf.startTimeCallback,
  studentHours: cf.studentHoursCallback,
  term: cf.termCallback,
  year: cf.yearCallback,
};

// TODO: parse duration and semester length
const registrarSpreadsheetFields: ValidFields = {
  AcademicYear: cf.yearCallback,
  BuildingAndRoom: cf.locationCallback,
  CourseNum: cf.numberCallback,
  Faculty: cf.instructorCallback,
  FacultyLoad: cf.facultyHoursCallback,
  GlobalMax: cf.globalMaxCallback,
  LocalMax: cf.localMaxCallback,
  MeetingDays: cf.daysCallback,
  MeetingStart: cf.startTimeCallback,
  MeetingTime: cf.durationCallback,
  MinimumCredits: cf.studentHoursCallback,
  RoomCapacity: cf.roomCapacityCallback,
  SectionCode: cf.letterCallback,
  SectionEndDate: cf.sectionEndCallback,
  SectionStartDate: cf.sectionStartCallback,
  ShortTitle: cf.nameCallback,
  SubjectCode: cf.prefixCallback,
  Term: cf.termCallback,
  Used: cf.anticipatedSizeCallback,
};

const callbacks: ValidFields = {
  ...pruimSpreadsheetFields,
  ...registrarSpreadsheetFields,
};

export const csvStringToSchedule = (csvString: string): Schedule => {
  const objects: papa.ParseResult<never> = papa.parse(csvString, {
    header: true,
    skipEmptyLines: true,
  });

  // Define variables for Schedule creation
  let section: Section;
  const schedule: Schedule = {
    courses: [],
  };

  // Get data and fields from the CSV
  const { data, meta } = objects;
  const { fields } = meta;

  // Parse each row of the CSV as an object
  data.forEach((object) => {
    // Reset defaults
    section = {
      anticipatedSize: 0,
      comments: "",
      globalMax: 0,
      instructors: [],
      letter: "",
      localMax: 0,
      meetings: [
        {
          days: [],
          duration: 0,
          location: { building: "", roomCapacity: 0, roomNumber: "" },
          startTime: "",
        },
      ],
      semesterLength: SemesterLength.Full,
      term: Term.Fall,
      year: new Date().getFullYear(),
    };

    const { meetings } = section;
    const course: Course = {
      facultyHours: 0,
      name: "",
      number: "",
      prefixes: [],
      sections: [],
      studentHours: 0,
    };
    const [firstMeeting] = meetings;

    // Iterate through the fields of the CSV, and parse their values for this object
    if (fields) {
      fields.forEach((field) => {
        const value = String(object[field]);
        field = field.replace(/\s/g, "");
        if (field in callbacks) {
          callbacks[field as keyof ValidFields](value, { course, firstMeeting, section });
        }
      });

      // Check if the meeting is empty, and should be removed
      if (firstMeeting.days === [] || firstMeeting.duration === 0) {
        section.meetings = [];
      }

      // Check if there is already a course in the schedule with the same prefix and number
      const existingCourse: Course[] = schedule.courses.filter((c) => {
        return (
          c.prefixes.some((p) => {
            return course.prefixes.includes(p);
          }) && c.number === course.number
        );
      });

      // If there is, add the new section to that course
      if (existingCourse.length > 0) {
        const existingCourseIndex = schedule.courses.indexOf(existingCourse[0]);
        schedule.courses[existingCourseIndex].sections.push(section);
      }
      // Otherwise, add the new course to the schedule
      else {
        course.sections.push(section);
        schedule.courses.push(course);
      }
    }
  });
  return schedule;
};
