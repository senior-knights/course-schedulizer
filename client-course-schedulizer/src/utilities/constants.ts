import { Course, Meeting, Section, Term } from "./interfaces";

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
  location: { building: "", roomNumber: "" },
  startTime: "",
};

export const emptySection: Section = {
  instructors: [],
  letter: "",
  meetings: [],
  term: Term.Fall,
};
