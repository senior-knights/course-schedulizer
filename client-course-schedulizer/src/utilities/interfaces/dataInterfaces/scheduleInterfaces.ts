/* eslint-disable typescript-sort-keys/string-enum */
import { Day, SemesterLength, Term } from ".";

export interface Location {
  building: string;
  roomCapacity?: number;
  roomNumber: string;
}

export interface Meeting {
  // All days on which the given Meeting time and room is applicable
  days: Day[];
  // In minutes (usually 50)
  duration: number;
  isConflict?: boolean;
  location: Location;
  // Like "8:00 AM" or "12:30 PM"
  startTime: string;
}

export type Prefix = string;

// If new non-identifying fields are added to this interface, must update updateNonIdentifyingCourseInfo()
export interface Course {
  department?: string;
  name: string;
  number: string;
  prefixes: Prefix[];
  sections: Section[];
}

// Updates all fields except for:
// - Identifying Fields: used for finding a Course in getCourse()
//                       includes: prefixes, number
//                       if any of these fields is changed, a new Course is made instead
// - Sections: if this field is changed, new sections are added and/or old ones deleted
// - Name: this is handled on the Section level instead
export const updateNonIdentifyingCourseInfo = (oldCourse: Course, newCourse: Course): Course => {
  oldCourse.department = newCourse.department;
  return oldCourse;
};

export type Instructor = string;

// If new non-identifying fields are added to this interface, must update updateNonIdentifyingSectionInfo()
export interface Section {
  anticipatedSize?: number;
  comments?: string;
  // Number of students enrolled in this section 10 days into the course
  day10Used?: number;
  // Like 2/3/2020
  endDate?: string;
  // Overrides Course value
  facultyHours: number;
  globalMax?: number;
  instructionalMethod?: string;
  instructors: Instructor[];
  isNonTeaching?: boolean;
  letter: string;
  localMax?: number;
  // Multiple Meetings possible if time/room differs on different days
  // Asynchronous classes should have an empty array of meeting times
  meetings: Meeting[];
  name?: string;
  semesterLength?: SemesterLength;
  // Like 5/21/2020
  startDate?: string;
  status?: string;
  // Overrides Course value
  studentHours: number;
  term: Term | Term[];
  // Like 9/3/2019
  termStart?: string;
  // Number of students enrolled in this section at the end of the course
  used?: number;
  year?: number | string;
}

// Updates all fields except for:
// - Identifying Fields: used for finding a Section in getSection()
//                       includes: letter, term, instructors, instructionalMethod
//                       if any of these fields is changed, a new Section is made instead
// - Meetings: if this field is changed, new meetings are added and/or old ones deleted
export const updateNonIdentifyingSectionInfo = (
  oldSection: Section,
  newSection: Section,
): Section => {
  oldSection.anticipatedSize = newSection.anticipatedSize;
  oldSection.comments = newSection.comments;
  oldSection.day10Used = newSection.day10Used;
  oldSection.endDate = newSection.endDate;
  oldSection.facultyHours = newSection.facultyHours;
  oldSection.globalMax = newSection.globalMax;
  oldSection.isNonTeaching = newSection.isNonTeaching;
  oldSection.localMax = newSection.localMax;
  oldSection.name = newSection.name;
  oldSection.semesterLength = newSection.semesterLength;
  oldSection.startDate = newSection.startDate;
  oldSection.status = newSection.status;
  oldSection.studentHours = newSection.studentHours;
  oldSection.termStart = newSection.termStart;
  oldSection.used = newSection.used;
  oldSection.year = newSection.year;
  return oldSection;
};

export interface Schedule {
  courses: Course[];
}

export interface CourseSectionMeeting {
  course: Course;
  meeting: Meeting;
  section: Section;
}
