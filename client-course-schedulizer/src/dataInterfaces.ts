export enum Term {
  Fall = "FA",
  Interim = "IN", // TODO: Remove?
  Spring = "SP",
  Summer = "SU", // TODO: Is this a thing?
}

export enum Half {
  First = "first",
  Full = "full",
  Second = "second",
}

export enum Day {
  Friday = "F",
  Monday = "M",
  // TODO: Are weekends ever used? (Can't really hurt to have them)
  Saturday = "S",
  Sunday = "Su",
  Thursday = "Th",
  Tuesday = "T",
  Wednesday = "W",
}

export interface Location {
  building: string;
  roomCapacity: number;
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

export interface Instructor {
  firstName: string;
  lastName: string;
}

export interface Course {
  facultyHours: number;
  name: string;
  number: string;
  prefix: string[];
  studentHours: number;
}

export interface Section {
  anticipatedSize: number;
  comments: string;
  course: Course;
  // Overrides Course value
  facultyHours?: number;
  globalMax: number;
  half: Half;
  instructors: Instructor[];
  letter: string;
  localMax: number;
  // Multiple Meetings possible if time/room differs on different days
  // Asynchronous classes should have an empty array of meeting times
  meetings: Meeting[];
  // Overrides Course value
  studentHours?: number;
  term: Term;
  year: number;
}

export interface Schedule {
  sections: Section[];
}
