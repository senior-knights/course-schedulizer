import moment from "moment";
import { Course, Meeting, Section, SemesterLength, Term } from "./interfaces";

export const INITIAL_DATE = "2000-01-02";

export const emptyCourse: Course = {
  department: "",
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
  day10Used: 0,
  endDate: "",
  globalMax: 0,
  instructionalMethod: "",
  instructors: [],
  letter: "",
  localMax: 0,
  meetings: [],
  semesterLength: SemesterLength.Full,
  startDate: "",
  status: "",
  term: Term.Fall,
  termStart: "",
  timestamp: moment.now(),
  used: 0,
  year: new Date().getFullYear(),
};
