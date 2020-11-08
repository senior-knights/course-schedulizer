import papa from "papaparse";
import * as di from "../interfaces/dataInterfaces";
import * as cf from "./caseFunctions";

interface ValidFields {
  [key: string]: (value: string, data: cf.CaseCallbackParams) => void;
}

const callbacks: ValidFields = {
  AcademicYear: cf.yearCase,
  BuildingAndRoom: cf.locationCase,
  CourseNum: cf.numberCase,
  Faculty: cf.instructorCase,
  FacultyLoad: cf.facultyHoursCase,
  GlobalMax: cf.globalMaxCase,
  LocalMax: cf.localMaxCase,
  MeetingDays: cf.daysCase,
  MeetingStart: cf.startTimeCase,
  MeetingTime: cf.durationCase,
  MinimumCredits: cf.studentHoursCase,
  RoomCapacity: cf.roomCapacityCase,
  SectionCode: cf.letterCase,
  ShortTitle: cf.nameCase,
  SubjectCode: cf.prefixCase,
  Term: cf.termCase,
  Used: cf.anticipatedSizeCase,
  anticipatedSize: cf.anticipatedSizeCase,
  comments: cf.commentsCase,
  days: cf.daysCase,
  duration: cf.durationCase,
  facultyHours: cf.facultyHoursCase,
  globalMax: cf.globalMaxCase,
  half: cf.semesterLengthCase,
  instructor: cf.instructorCase,
  instructors: cf.instructorCase,
  localMax: cf.localMaxCase,
  location: cf.locationCase,
  name: cf.nameCase,
  number: cf.numberCase,
  prefix: cf.prefixCase,
  prefixes: cf.prefixCase,
  roomCapacity: cf.roomCapacityCase,
  section: cf.letterCase,
  semesterLength: cf.semesterLengthCase,
  startTime: cf.startTimeCase,
  startTimeStr: cf.startTimeCase,
  studentHours: cf.studentHoursCase,
  term: cf.termCase,
  year: cf.yearCase,
};

export const csvStringToSchedule = (csvString: string): di.Schedule => {
  const objects: papa.ParseResult<never> = papa.parse(csvString, {
    header: true,
    skipEmptyLines: true,
  });

  // Define variables for Schedule creation
  let section: di.Section;
  const schedule: di.Schedule = {
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
      semesterLength: di.SemesterLength.Full,
      term: di.Term.Fall,
      year: new Date().getFullYear(),
    };

    const { meetings } = section;
    const course: di.Course = {
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
      const existingCourse: di.Course[] = schedule.courses.filter((c) => {
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
