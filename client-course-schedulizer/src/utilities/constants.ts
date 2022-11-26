import rawTimes from 'data/times.json';
import { militaryTo12Hour } from './helpers';

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
    importRank: 0,
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
  importRank: 0,
  name: "",
  number: "",
  prefixes: [],
  sections: [],
};

export const emptyMeeting: Meeting = {
  days: [],
  duration: 0,
  isConflict: false,
  isNonstandardTime: false,
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

export const legalTimes = new Set<string>();

rawTimes.times.forEach(entry => {
  entry.day.forEach(day => {
    entry.time.forEach(startTime => {
      startTime = militaryTo12Hour(startTime);
      entry.duration.forEach(duration => {
        legalTimes.add(`${day} -- ${startTime} -- ${duration}`);
      })
    })
  })  
 })

// TODO: Delete this code
// export const setConstraints = (constraints: JSON) => {
//   return constraints;
// };
