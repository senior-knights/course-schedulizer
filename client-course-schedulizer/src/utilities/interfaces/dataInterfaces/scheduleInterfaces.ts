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
  // Like "8:00AM" or "12:30PM"
  startTime: string;
}

export type Prefix = string;

export interface Course {
  facultyHours: number;
  name: string;
  number: string;
  prefixes: Prefix[];
  sections: Section[];
  studentHours: number;
}

export type Instructor = string;

export interface Section {
  anticipatedSize: number;
  comments: string;
  // Overrides Course value
  facultyHours?: number;
  globalMax: number;
  instructors: Instructor[];
  letter: string;
  localMax: number;
  // Multiple Meetings possible if time/room differs on different days
  // Asynchronous classes should have an empty array of meeting times
  meetings: Meeting[];
  semesterLength: SemesterLength;
  startSectionDate?: string;
  // Overrides Course value
  studentHours?: number;
  term: Term;
  year: number | string;
}

export interface Schedule {
  courses: Course[];
}
