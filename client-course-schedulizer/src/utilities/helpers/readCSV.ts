import papa from "papaparse";
import { Course, Schedule, Section, SemesterLength, Term } from "utilities";
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

const registrarSpreadsheetFields: ValidFields = {
  AcademicYear: cf.yearCallback,
  BuildingAndRoom: cf.locationCallback,
  Comments: cf.commentsCallback,
  CourseNum: cf.numberCallback,
  Day10Used: cf.day10UsedCallback,
  Department: cf.departmentCallback,
  Faculty: cf.instructorCallback,
  FacultyLoad: cf.facultyHoursCallback,
  GlobalMax: cf.globalMaxCallback,
  InstructionalMethod: cf.instructionalMethodCallback,
  LocalMax: cf.localMaxCallback,
  MeetingDays: cf.daysCallback,
  MeetingDurationMinutes: cf.durationCallback,
  MeetingStart: cf.startTimeCallback,
  MeetingTime: cf.durationCallback,
  MinimumCredits: cf.studentHoursCallback,
  RoomCapacity: cf.roomCapacityCallback,
  SectionCode: cf.letterCallback,
  SectionEndDate: cf.endDateCallback,
  SectionStartDate: cf.startDateCallback,
  SectionStatus: cf.statusCallback,
  ShortTitle: cf.nameCallback,
  SubjectCode: cf.prefixCallback,
  Term: cf.termCallback,
  TermStart: cf.termStartCallback,
  Used: cf.usedCallback,
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
      day10Used: 0,
      endDate: "",
      globalMax: 0,
      instructionalMethod: "",
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
      startDate: "",
      status: "",
      term: Term.Fall,
      termStart: "",
      used: 0,
      year: new Date().getFullYear(),
    };

    const { meetings } = section;
    const course: Course = {
      department: "",
      facultyHours: 0,
      name: "",
      number: "",
      prefixes: [],
      sections: [],
      studentHours: 0,
    };

    // Iterate through the fields of the CSV, and parse their values for this object
    // TODO: Create a sense of priority for MeetingDurationMinutes over MeetingTime and SemesterLength over SemesterEndDate - SemesterStartDate
    if (fields) {
      fields.forEach((field) => {
        const value = String(object[field]);
        field = field.replace(/\s/g, "");
        if (field in callbacks) {
          callbacks[field as keyof ValidFields](value, { course, meetings, section });
        }
      });

      // Insert the Section to the Schedule, either as a new Course or to an existing Course
      insertSectionCourse(schedule, section, course);
    }
  });
  return schedule;
};

export const insertSectionCourse = (schedule: Schedule, section: Section, course: Course) => {
  const { meetings } = section;

  // Check if any meetings are empty, and should be removed
  // TODO: What about TBA meetings where the location is specified but not the time
  //       (currently allowing these causes the app to crash)
  section.meetings = meetings.filter((meeting) => {
    return meeting.days.length > 0 && meeting.duration > 0;
  });

  // Check if there is already a course in the schedule with the same prefix and number
  const existingCourse: Course[] = schedule.courses.filter((c) => {
    return (
      c.prefixes.some((p) => {
        return course.prefixes.includes(p);
      }) && c.number === course.number
    );
  });

  // If there is, first check if there is already a section for that course with the same letter and term
  if (existingCourse.length > 0) {
    const existingCourseIndex = schedule.courses.indexOf(existingCourse[0]);
    const existingSection: Section[] = existingCourse[0].sections.filter((s) => {
      // TODO: Should we check year and/or semesterLength here as well?
      return s.letter === section.letter && s.term === section.term;
    });

    // If there is, add the new meeting(s) to the existing course
    if (existingSection.length > 0) {
      const existingSectionIndex = schedule.courses[existingCourseIndex].sections.indexOf(
        existingSection[0],
      );
      // TODO: Avoid duplicate meetings?
      schedule.courses[existingCourseIndex].sections[
        existingSectionIndex
      ].meetings = schedule.courses[existingCourseIndex].sections[
        existingSectionIndex
      ].meetings.concat(section.meetings);
    }
    // Otherwise, add the new section to the existing course
    else {
      schedule.courses[existingCourseIndex].sections.push(section);
    }
  }
  // Otherwise, add the new course to the schedule
  else {
    course.sections.push(section);
    schedule.courses.push(course);
  }
};
