import moment from "moment";
import * as di from "../interfaces/dataInterfaces";

export interface CaseCallbackParams {
  course: di.Course;
  firstMeeting: di.Meeting;
  section: di.Section;
}

// Define regexes for parsing
// const timeReg = RegExp("(?<![1-9])(1[0-9]|2[0-3]|[0-9]):([0-5][0-9])");
// const amReg = RegExp("[Aa][Mm]");
// const pmReg = RegExp("[Pp][Mm]");
const fallReg = RegExp("[Ff]");
const summerReg = RegExp("[Ss][Uu]|[Mm][Aa]");
const springReg = RegExp("[Ss](?![Uu])");
// "W" represents interim in Pruim's system it seems
const interimReg = RegExp("[Ii]|[Ww]");
const sunReg = RegExp("[Ss][Uu]|[Nn]");
const monReg = RegExp("[Mm]");
const tuesReg = RegExp("[Tt](?![Hh])");
const wedReg = RegExp("[Ww]");
const thursReg = RegExp("[Tt][Hh]|[Rr]");
const friReg = RegExp("[Ff]");
const satReg = RegExp("[Ss](?![Uu])");

export const startTimeCase = (value: string, { firstMeeting }: CaseCallbackParams) => {
  firstMeeting.startTime = moment(value, "h:mma").isValid() ? value : "";
};

export const locationCase = (value: string, { firstMeeting }: CaseCallbackParams) => {
  const roomParts = value.trim().split(" ");
  if (roomParts.length === 1) {
    // No room number given
    [firstMeeting.location.building, firstMeeting.location.roomNumber] = [roomParts[0], ""];
  }
  if (roomParts.length === 2) {
    // Building and room number given
    [firstMeeting.location.building, firstMeeting.location.roomNumber] = roomParts;
  }
  // Too many room parts given, assume last part is room number and rest is building
  [firstMeeting.location.building, firstMeeting.location.roomNumber] = [
    roomParts.slice(0, -1).join(" "),
    roomParts.slice(-1)[0],
  ];
};

export const termCase = (value: string, { section }: CaseCallbackParams) => {
  if (fallReg.test(value)) {
    section.term = di.Term.Fall;
  } else if (summerReg.test(value)) {
    section.term = di.Term.Summer;
  } else if (springReg.test(value)) {
    section.term = di.Term.Spring;
  } else if (interimReg.test(value)) {
    section.term = di.Term.Interim;
  } else {
    // eslint-disable-next-line no-console
    console.log(`Term of "${value}" is unreadable, defaulting to Fall`);
    section.term = di.Term.Fall;
  }
};

export const semesterLengthCase = (value: string, { section }: CaseCallbackParams) => {
  const upperValue = value.toUpperCase();
  const lowerValue = value.toLowerCase();
  if (lowerValue === "first") {
    section.semesterLength = di.SemesterLength.HalfFirst;
  } else if (lowerValue === "second") {
    section.semesterLength = di.SemesterLength.HalfSecond;
  } else if (lowerValue === "full") {
    section.semesterLength = di.SemesterLength.Full;
  } else if (upperValue === "A") {
    section.semesterLength = di.SemesterLength.IntensiveA;
  } else if (upperValue === "B") {
    section.semesterLength = di.SemesterLength.IntensiveB;
  } else if (upperValue === "C") {
    section.semesterLength = di.SemesterLength.IntensiveC;
  } else if (upperValue === "D") {
    section.semesterLength = di.SemesterLength.IntensiveD;
  } else {
    // eslint-disable-next-line no-console
    console.log(`Semester Length of "${value}" is unreadable, defaulting to Full`);
    section.semesterLength = di.SemesterLength.Full;
  }
};

export const daysCase = (value: string, { firstMeeting }: CaseCallbackParams) => {
  if (sunReg.test(value)) {
    firstMeeting.days.push(di.Day.Sunday);
  }
  if (monReg.test(value)) {
    firstMeeting.days.push(di.Day.Monday);
  }
  if (tuesReg.test(value)) {
    firstMeeting.days.push(di.Day.Tuesday);
  }
  if (wedReg.test(value)) {
    firstMeeting.days.push(di.Day.Wednesday);
  }
  if (thursReg.test(value)) {
    firstMeeting.days.push(di.Day.Thursday);
  }
  if (friReg.test(value)) {
    firstMeeting.days.push(di.Day.Friday);
  }
  if (satReg.test(value)) {
    firstMeeting.days.push(di.Day.Saturday);
  }
};

export const instructorCase = (value: string, { section }: CaseCallbackParams) => {
  const instructors = value.split(/[;,\n]/);
  section.instructors = instructors.map((instructor) => {
    return instructor.trim();
  });
};

export const sectionStartCase = (value: string, { section }: CaseCallbackParams) => {
  section.startSectionDate = value;
};

export const sectionEndCase = (value: string, { section }: CaseCallbackParams) => {
  const sectionStart = moment(section.startSectionDate, "l");
  const sectionEnd = moment(value, "l");
  const sectionLength = sectionEnd.diff(sectionStart, "days");
  const startMonth = sectionStart.month();
  const firstStartMonths = [0, 1, 7, 8]; // Jan, Feb, Aug, Sept
  if (sectionLength > 80) {
    section.semesterLength = di.SemesterLength.Full;
  } else if (sectionLength > 35 && sectionLength <= 80) {
    section.semesterLength = firstStartMonths.includes(startMonth)
      ? di.SemesterLength.HalfFirst
      : di.SemesterLength.HalfSecond;
  } else {
    // TODO: Figure out if intensive is A, B, C, or D
    section.semesterLength = di.SemesterLength.IntensiveA;
  }
};

export const prefixCase = (value: string, { course }: CaseCallbackParams) => {
  course.prefixes = value.replace(" ", "").split(/[;,]/);
};

export const nameCase = (value: string, { course }: CaseCallbackParams) => {
  course.name = value;
};

export const numberCase = (value: string, { course }: CaseCallbackParams) => {
  course.number = value;
};

export const letterCase = (value: string, { section }: CaseCallbackParams) => {
  section.letter = value;
};

export const globalMaxCase = (value: string, { section }: CaseCallbackParams) => {
  section.globalMax = Number.isInteger(Number(value)) ? Number(value) : 0;
};

export const localMaxCase = (value: string, { section }: CaseCallbackParams) => {
  section.localMax = Number.isInteger(Number(value)) ? Number(value) : 0;
};

export const anticipatedSizeCase = (value: string, { section }: CaseCallbackParams) => {
  section.anticipatedSize = Number.isInteger(Number(value)) ? Number(value) : 0;
};

export const commentsCase = (value: string, { section }: CaseCallbackParams) => {
  section.comments = value;
};

export const yearCase = (value: string, { section }: CaseCallbackParams) => {
  section.year = Number.isInteger(Number(value)) ? Number(value) : value;
};

export const studentHoursCase = (value: string, { course }: CaseCallbackParams) => {
  course.studentHours = Number.isInteger(Number(value)) ? Number(value) : 0;
};

export const facultyHoursCase = (value: string, { course }: CaseCallbackParams) => {
  course.facultyHours = Number.isInteger(Number(value)) ? Number(value) : 0;
};

export const durationCase = (value: string, { firstMeeting }: CaseCallbackParams) => {
  if (Number.isInteger(Number(value))) {
    firstMeeting.duration = Number(value);
  } else {
    const [startTime, endTime] = value.split(" ").join("").split("-");
    const startTimeMoment = moment(startTime, "h:mma");
    const endTimeMoment = moment(endTime, "h:mma");
    firstMeeting.duration = endTimeMoment.diff(startTimeMoment, "minutes");
  }
};

export const roomCapacityCase = (value: string, { firstMeeting }: CaseCallbackParams) => {
  firstMeeting.location.roomCapacity = Number.isInteger(Number(value)) ? Number(value) : 0;
};
