import { cloneDeep, isEqual } from "lodash";
import papa from "papaparse";
import {
  Course,
  emptyCourse,
  emptySection,
  isStandardTime,
  Meeting,
  Schedule,
  Section,
  updateNonIdentifyingCourseInfo,
  updateNonIdentifyingSectionInfo,
} from "utilities";
import { getCourse, getSection, isNonTeaching } from "utilities/services";
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
  // globalMax: cf.globalMaxCallback,
  half: cf.semesterLengthCallback,
  instructor: cf.instructorCallback,
  instructors: cf.instructorCallback,
  // localMax: cf.localMaxCallback,
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
  AcademicPeriod: cf.termCallback,
  AcademicYear: cf.yearCallback,
  Comments: cf.commentsCallback,
  Course: cf.courseCallback,
  CourseNum: cf.numberCallback,
  CourseSection: cf.courseSectionCallback,
  // Day10Used: cf.day10UsedCallback,
  DeliveryMode: cf.deliveryModeCallback,
  Department: cf.departmentCallback,
  EndDate: cf.endDateCallback,
  FacultyLoad: cf.facultyHoursCallback,
  // GlobalMax: cf.globalMaxCallback,
  Group: cf.groupCallback,
  InstructionalMethod: cf.instructionalMethodCallback,
  Instructors: cf.instructorCallback,
  LastEditTimestamp: cf.timestampCallback,
  Location1: cf.locationCallback,
  // Location2: cf.locationCallback,
  // LocalMax: cf.localMaxCallback,
  MeetingDays: cf.daysCallback,
  MeetingDurationMinutes: cf.durationCallback,
  MeetingPatterns: cf.meetingPatternCallback,
  MeetingStart: cf.startTimeCallback,
  MeetingTime: cf.timeCallback,
  MinimumCredits: cf.studentHoursCallback,
  RoomCapacity: cf.roomCapacityCallback,
  SectionCode: cf.letterCallback,
  SectionStatus: cf.statusCallback,
  SemesterHours: cf.semesterHourCallback,
  SemesterLength: cf.semesterLengthCallback,
  ShortTitle: cf.nameCallback,
  // StartDate: cf.termStartCallback,
  StartDate: cf.startDateCallback,
  SubjectCode: cf.prefixCallback,
  // Used: cf.usedCallback,
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
    numDistinctSchedules: 1,
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
      section.instructionalMethod,
      section.deliveryMode,
    );

    // Update Course fields which were changed
    schedule.courses[existingCourseIndex] = updateNonIdentifyingCourseInfo(existingCourse, course);
    if (course.name !== schedule.courses[existingCourseIndex].name) {
      section.name = course.name;
    }

    // Update the section name if the received name is different than the course name (section name will override the course name)
    if (course.name !== schedule.courses[existingCourseIndex].name) {
      section.name = course.name;
    }

    // If there is, add the new meeting(s) to the existing course
    if (existingSection) {
      const existingSectionIndex = schedule.courses[existingCourseIndex].sections.indexOf(
        existingSection,
      );
      const newMeetings = section.meetings;
      newMeetings.forEach(meeting => {meeting.isNonstandardTime = !isStandardTime(meeting)});

      // Update Section fields which were changed
      schedule.courses[existingCourseIndex].sections[
        existingSectionIndex
      ] = updateNonIdentifyingSectionInfo(existingSection, section);

      // Only add meetings which don't already exist
      newMeetings.forEach((newMeeting) => {
        let meetingExists = false;
        schedule.courses[existingCourseIndex].sections[existingSectionIndex].meetings.forEach(
          (oldMeeting) => {
            // Short-circuit if duplicate is found
            if (!meetingExists && isEqual(newMeeting, oldMeeting)) {
              meetingExists = true;
            }
          },
        );
        if (!meetingExists) {
          schedule.courses[existingCourseIndex].sections[
            existingSectionIndex
          ].meetings = schedule.courses[existingCourseIndex].sections[
            existingSectionIndex
          ].meetings.concat(newMeeting);
        }
      });
    }
    // Otherwise, add the new section to the existing course
    else {
      section.isNonTeaching = isNonTeaching(course, section);
      section.meetings.forEach(meeting => {meeting.isNonstandardTime = !isStandardTime(meeting)});
      schedule.courses[existingCourseIndex].sections.push(section);
    }
  }
  // Otherwise, add the new course to the schedule
  else {
    section.isNonTeaching = isNonTeaching(course, section);
    section.meetings.forEach(meeting => {meeting.isNonstandardTime = !isStandardTime(meeting)});
    course.sections.push(section);
    schedule.courses.push(course);
  }
  return schedule;
};

