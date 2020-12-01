import { Course, Meeting, Section, SemesterLength, Term } from "./interfaces";

export const INITIAL_DATE = "2000-01-02";

export const emptyCourse: Course = {
  facultyHours: 0,
  name: "",
  number: "",
  prefixes: [],
  sections: [],
  studentHours: 0,
};

export const emptyMeeting: Meeting = {
  days: [],
  duration: 0,
  location: { building: "", roomCapacity: 0, roomNumber: "" },
  startTime: "",
};

export const emptySection: Section = {
  anticipatedSize: 0,
  comments: "",
  globalMax: 0,
  instructors: [],
  letter: "",
  localMax: 0,
  meetings: [],
  semesterLength: SemesterLength.Full,
  term: Term.Fall,
  year: new Date().getFullYear(),
};
