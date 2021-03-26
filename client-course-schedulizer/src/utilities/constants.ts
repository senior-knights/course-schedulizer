import { Course, Meeting, Section, Term } from "./interfaces";

export const INITIAL_DATE = "2000-01-02";

export const emptyCourse: Course = {
  name: "",
  number: "",
  prefixes: [],
  sections: [],
};

export const emptyMeeting: Meeting = {
  days: [],
  duration: 0,
  location: { building: "", roomNumber: "" },
  startTime: "",
};

export const emptySection: Section = {
  facultyHours: -1,
  instructors: [],
  letter: "",
  meetings: [],
  studentHours: -1,
  term: Term.Fall,
};
