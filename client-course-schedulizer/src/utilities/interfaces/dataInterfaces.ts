/* eslint-disable typescript-sort-keys/string-enum */
export enum Term {
  Fall = "FA",
  Interim = "IN", // TODO: Remove?
  Spring = "SP",
  Summer = "SU", // TODO: Is this a thing?
}

export enum SemesterLength {
  Full = "Full",
  HalfFirst = "First",
  HalfSecond = "Second",
  IntensiveA = "A",
  IntensiveB = "B",
  IntensiveC = "C",
  IntensiveD = "D",
}

export enum Day {
  Monday = "M",
  Tuesday = "T",
  Wednesday = "W",
  Thursday = "TH",
  Friday = "F",
  Saturday = "S",
  Sunday = "SU",
}

export enum Half {
  First = SemesterLength.HalfFirst,
  Second = SemesterLength.HalfSecond,
}

export enum Intensive {
  A = SemesterLength.IntensiveA,
  B = SemesterLength.IntensiveB,
  C = SemesterLength.IntensiveC,
  D = SemesterLength.IntensiveD,
}

export enum SemesterLengthOption {
  FullSemester = "Full",
  HalfSemester = "Half",
  IntensiveSemester = "Intensive",
}

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

export interface Course {
  department: string;
  facultyHours: number;
  name: string;
  number: string;
  prefixes: string[];
  sections: Section[];
  studentHours: number;
}

export interface Section {
  anticipatedSize?: number;
  comments: string;
  // Number of students enrolled in this section 10 days into the course
  day10Used: number;
  // Like 2/3/2020
  endDate: string;
  // Overrides Course value
  facultyHours?: number;
  globalMax: number;
  instructionalMethod: string;
  instructors: string[];
  letter: string;
  localMax: number;
  // Multiple Meetings possible if time/room differs on different days
  // Asynchronous classes should have an empty array of meeting times
  meetings: Meeting[];
  semesterLength: SemesterLength;
  // Like 5/21/2020
  startDate: string;
  status: string;
  // Overrides Course value
  studentHours?: number;
  term: Term;
  // Like 9/3/2019
  termStart: string;
  // Number of students enrolled in this section at the end of the course
  used: number;
  year: number | string;
}

export interface Schedule {
  courses: Course[];
}
