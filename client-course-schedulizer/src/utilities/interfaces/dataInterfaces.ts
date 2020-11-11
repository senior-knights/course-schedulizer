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
  Thursday = "Th",
  Friday = "F",
  Saturday = "S",
  Sunday = "Su",
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
  // Like "8:00AM" or "12:30PM"
  startTime: string;
}

// TODO: Some instructors have middle name, others have middle initials, some have professor prepended.
// Maybe handle this by simply keeping this as a string?
export interface Instructor {
  firstName: string;
  lastName: string;
}

export interface Course {
  facultyHours: number;
  name: string;
  number: string;
  prefixes: string[];
  sections: Section[];
  studentHours: number;
}

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
  semesterLength: SemesterLength | string;
  // Overrides Course value
  studentHours?: number;
  term: Term;
  year: number | string;
}

export interface Schedule {
  courses: Course[];
}
