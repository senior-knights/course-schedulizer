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
  location: Location;
  // Like "8:00 AM" or "12:30 PM"
  startTime: string;
}

export type Prefix = string;

export interface Course {
  department?: string;
  name: string;
  number: string;
  prefixes: Prefix[];
  sections: Section[];
}

export type Instructor = string;

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

export interface Schedule {
  courses: Course[];
}

export interface CourseSectionMeeting {
  course: Course;
  meeting: Meeting;
  section: Section;
}
