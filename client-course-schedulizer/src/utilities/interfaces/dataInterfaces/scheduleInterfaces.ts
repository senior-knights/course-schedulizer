/* eslint-disable typescript-sort-keys/string-enum */
import { ConflictRow } from "utilities";
import { Day, SemesterLength, Term } from ".";

export interface Location {
  building: string;
  roomCapacity?: number;
  roomNumber: string;
}

export interface Meeting {
  // All days on which the given Meeting time and room is applicable
  days: Day[];
  // In minutes 
  duration: number;
  isConflict?: boolean;
  isNonstandardTime?: boolean;
  location: Location;
  // Like "8:00 AM" or "12:30 PM"
  startTime: string;
}

export type Prefix = string;

// If new non-identifying fields are added to this interface, must update updateNonIdentifyingCourseInfo()
// If new identifying fields are added to this interface, must update updateIdentifyingCourseInfo()
export interface Course {
  department?: string;
  importRank: number;
  name: string;
  number: string;
  prefixes: Prefix[];
  sections: Section[];
}

// Updates all Course fields except for:
// - Identifying Fields: used for finding a Course in getCourse()
//                       includes: prefixes, number
// - Sections: if this field is changed, new sections are added and/or old ones deleted
// - Name: this is handled on the Section level instead
export const updateNonIdentifyingCourseInfo = (oldCourse: Course, newCourse: Course): Course => {
  oldCourse.department = newCourse.department;
  return oldCourse;
};

// Updates all identifying Course fields
//  includes: prefixes, number
export const updateIdentifyingCourseInfo = (oldCourse: Course, newCourse: Course): Course => {
  oldCourse.prefixes = newCourse.prefixes;
  oldCourse.number = newCourse.number;
  return oldCourse;
};

export type Instructor = string;

// If new non-identifying fields are added to this interface, must update updateNonIdentifyingSectionInfo()
// If new identifying fields are added to this interface, must update updateIdentifyingSectionInfo()
export interface Section {
  anticipatedSize?: number;
  comments?: string;
  // Number of students enrolled in this section 10 days into the course
  day10Used?: number;
  // Like 2/3/2020
  endDate?: string;
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
  studentHours: number;
  term: Term | Term[];
  // Like 9/3/2019
  termStart?: string;
  timestamp?: string;
  // Number of students enrolled in this section at the end of the course
  used?: number;
  year?: number | string;
}

// Updates all Section fields except for:
// - Identifying Fields: used for finding a Section in getSection()
//                       includes: letter, term, instructors, instructionalMethod
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

// Updates all identifying Section fields
//  includes: letter, term, instructors, instructionalMethod
export const updateIdentifyingSectionInfo = (oldSection: Section, newSection: Section): Section => {
  oldSection.letter = newSection.letter;
  oldSection.term = newSection.term;
  oldSection.instructors = newSection.instructors;
  oldSection.instructionalMethod = newSection.instructionalMethod;
  return oldSection;
};

export interface Schedule {
  conflicts?: ConflictRow[] | undefined;
  courses: Course[];
  numDistinctSchedules: number;
}

export interface CourseSectionMeeting {
  course: Course;
  meeting: Meeting;
  section: Section;
}
