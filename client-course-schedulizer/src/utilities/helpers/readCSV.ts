import { cloneDeep } from "lodash";
import papa from "papaparse";
import { Course, emptyCourse, emptySection, Meeting, Schedule, Section } from "utilities";
import { getCourse, getSection } from "utilities/services";
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
  MeetingTime: cf.timeCallback,
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

const templateSpreadsheetFields: ValidFields = {
  Days: cf.daysCallback,
  FacLoad: cf.facultyHoursCallback,
  NonTeachingActivity: cf.nonTeachingActivityCallback,
  Room: cf.locationCallback,
  SectionName: cf.sectionCallback,
  StuCred: cf.studentHoursCallback,
  Terms: cf.termCallback,
};

const callbacks: ValidFields = {
  ...pruimSpreadsheetFields,
  ...registrarSpreadsheetFields,
  ...templateSpreadsheetFields,
};

export const csvStringToSchedule = (csvString: string): Schedule => {
  // Remove junk from Excel export to CSV
  csvString = csvString.replace("ï»¿", "");

  // Remove title rows from template spreadsheet. Perhaps there is a better way to check if it is in the template format
  if (csvString.startsWith("2")) {
    csvString = csvString.split("\n").slice(2).join("\n");
  }

  const objects: papa.ParseResult<never> = papa.parse(csvString, {
    header: true,
    skipEmptyLines: "greedy",
  });

  // Define variables for Schedule creation
  const schedule: Schedule = {
    courses: [],
  };

  // Get data and fields from the CSV
  const { data, meta } = objects;
  const { fields } = meta;

  // Parse each row of the CSV as an object
  data.forEach((object) => {
    // Reset defaults
    const section = cloneDeep(emptySection);
    const meetings: Meeting[] = [];
    const course: Course = cloneDeep(emptyCourse);

    // Iterate through the fields of the CSV, and parse their values for this object
    // TODO: Create a sense of priority for MeetingDurationMinutes over MeetingTime and SemesterLength over SemesterEndDate - SemesterStartDate
    if (fields) {
      fields.forEach((field) => {
        const value = String(object[field]);
        field = field.replace(/\s/g, "").replace("(", "").replace(")", "").replace("-", "");
        if (field in callbacks) {
          callbacks[field as keyof ValidFields](value, { course, meetings, section });
        }
      });

      // Insert the Section to the Schedule, either as a new Course or to an existing Course
      section.meetings = meetings;
      insertSectionCourse(schedule, section, course);
    }
  });
  return schedule;
};

// Insert the Section to the Schedule, either as a new Course or to an existing Course
export const insertSectionCourse = (schedule: Schedule, section: Section, course: Course) => {
  const { meetings } = section;

  // Check if any meetings are empty, and should be removed
  // TODO: What about TBA meetings where the location is specified but not the time
  //       (currently allowing these causes the app to crash)
  section.meetings = meetings.filter((meeting) => {
    return meeting.days?.length > 0 && meeting.duration > 0;
  });

  // Check if there is already a course in the schedule with the same prefix and number
  const existingCourse = getCourse(schedule, course.prefixes, course.number);

  // If there is, first check if there is already a section for that course with the same letter, instructors, and term
  if (existingCourse) {
    const existingCourseIndex = schedule.courses.indexOf(existingCourse);
    const existingSection = getSection(
      schedule,
      course.prefixes,
      course.number,
      section.letter,
      section.term,
      section.instructors,
    );

    // If there is, add the new meeting(s) to the existing course
    if (existingSection) {
      const existingSectionIndex = schedule.courses[existingCourseIndex].sections.indexOf(
        existingSection,
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

  return schedule;
};
