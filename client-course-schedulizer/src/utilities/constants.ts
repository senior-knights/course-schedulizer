import {
  Course,
  CourseSectionMeeting,
  Day,
  Meeting,
  Section,
  SemesterLengthOption,
  Term,
} from "./interfaces";
import { SectionInput } from "./services/addSectionService";

export const INITIAL_DATE = "2000-01-02";

export const WILDCARD = "*";

export const WILDCARD_COLOR = "silver";

export const WILDCARD_DATA: SectionInput = {
  days: [Day.Monday, Day.Tuesday, Day.Wednesday, Day.Thursday, Day.Friday],
  duration: 50,
  instructor: ["*"],
  location: "*",
  name: "*",
  number: "*",
  prefix: ["*"],
  section: "*",
  semesterLength: SemesterLengthOption.FullSemester,
  startTime: "11:00 AM",
  term: Term.Fall,
  year: "2021",
};

export const WILDCARD_VALUES: CourseSectionMeeting = {
  course: {
    name: "*",
    number: "*",
    prefixes: ["*"],
    sections: [],
  },
  meeting: {
    days: [Day.Monday, Day.Tuesday, Day.Wednesday, Day.Thursday, Day.Friday],
    duration: 50,
    location: { building: "*", roomNumber: "*" },
    startTime: "11:00 AM",
  },
  section: {
    facultyHours: 0,
    instructors: ["*"],
    letter: "*",
    meetings: [],
    studentHours: 0,
    term: Term.Fall,
  },
};

export const emptyCourse: Course = {
  name: "",
  number: "",
  prefixes: [],
  sections: [],
};

export const emptyMeeting: Meeting = {
  days: [],
  duration: 0,
  isConflict: false,
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
