import moment from "moment";
import { Course, Day, Meeting, Section, SemesterLength, Term } from "../interfaces/dataInterfaces";

export interface CaseCallbackParams {
  course: Course;
  firstMeeting: Meeting;
  section: Section;
}

export const MIN_HALF_LENGTH = 35;
export const MAX_HALF_LENGTH = 80;

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

export const startTimeCallback = (value: string, { firstMeeting }: CaseCallbackParams) => {
  firstMeeting.startTime = startTimeCase(value);
};

export const locationCallback = (value: string, { firstMeeting }: CaseCallbackParams) => {
  [firstMeeting.location.building, firstMeeting.location.roomNumber] = locationCase(value);
};

export const termCallback = (value: string, { section }: CaseCallbackParams) => {
  section.term = termCase(value);
};

export const semesterLengthCallback = (value: string, { section }: CaseCallbackParams) => {
  section.semesterLength = semesterLengthCase(value);
};

export const daysCallback = (value: string, { firstMeeting }: CaseCallbackParams) => {
  firstMeeting.days = daysCase(value);
};

export const instructorCallback = (value: string, { section }: CaseCallbackParams) => {
  section.instructors = instructorCase(value);
};

export const prefixCallback = (value: string, { course }: CaseCallbackParams) => {
  course.prefixes = prefixCase(value);
};

export const nameCallback = (value: string, { course }: CaseCallbackParams) => {
  course.name = value;
};

export const numberCallback = (value: string, { course }: CaseCallbackParams) => {
  course.number = value;
};

export const letterCallback = (value: string, { section }: CaseCallbackParams) => {
  section.letter = value;
};

export const globalMaxCallback = (value: string, { section }: CaseCallbackParams) => {
  section.globalMax = numberDefaultZeroCase(value);
};

export const localMaxCallback = (value: string, { section }: CaseCallbackParams) => {
  section.localMax = numberDefaultZeroCase(value);
};

export const anticipatedSizeCallback = (value: string, { section }: CaseCallbackParams) => {
  section.anticipatedSize = numberDefaultZeroCase(value);
};

export const commentsCallback = (value: string, { section }: CaseCallbackParams) => {
  section.comments = value;
};

export const yearCallback = (value: string, { section }: CaseCallbackParams) => {
  section.year = yearCase(value);
};

export const studentHoursCallback = (value: string, { course }: CaseCallbackParams) => {
  course.studentHours = numberDefaultZeroCase(value);
};

export const facultyHoursCallback = (value: string, { course }: CaseCallbackParams) => {
  course.facultyHours = numberDefaultZeroCase(value);
};

export const durationCallback = (value: string, { firstMeeting }: CaseCallbackParams) => {
  firstMeeting.duration = durationCase(value);
};

export const roomCapacityCallback = (value: string, { firstMeeting }: CaseCallbackParams) => {
  firstMeeting.location.roomCapacity = numberDefaultZeroCase(value);
};

export const sectionStartCallback = (value: string, { section }: CaseCallbackParams) => {
  section.startSectionDate = value;
};

export const sectionEndCallback = (value: string, { section }: CaseCallbackParams) => {
  section.semesterLength = sectionEndCase(value, section.startSectionDate);
};

export const startTimeCase = (value: string): string => {
  return moment(value, "h:mma").isValid() ? value : "";
};

export const locationCase = (value: string): string[] => {
  const roomParts = value.trim().split(" ");
  if (roomParts.length === 1) {
    // No room number given
    return [roomParts[0], ""];
  }
  if (roomParts.length === 2) {
    // Building and room number given
    return roomParts;
  }
  // Too many room parts given, assume last part is room number and rest is building
  return [roomParts.slice(0, -1).join(" "), roomParts.slice(-1)[0]];
};

export const termCase = (value: string): Term => {
  if (fallReg.test(value)) {
    return Term.Fall;
  }
  if (summerReg.test(value)) {
    return Term.Summer;
  }
  if (springReg.test(value)) {
    return Term.Spring;
  }
  if (interimReg.test(value)) {
    return Term.Interim;
  }
  // eslint-disable-next-line no-console
  console.log(`Term of "${value}" is unreadable, defaulting to Fall`);
  return Term.Fall;
};

export const semesterLengthCase = (value: string): SemesterLength => {
  const upperValue = value.toUpperCase();
  const lowerValue = value.toLowerCase();
  if (lowerValue === "first") {
    return SemesterLength.HalfFirst;
  }
  if (lowerValue === "second") {
    return SemesterLength.HalfSecond;
  }
  if (lowerValue === "full") {
    return SemesterLength.Full;
  }
  if (upperValue === "A") {
    return SemesterLength.IntensiveA;
  }
  if (upperValue === "B") {
    return SemesterLength.IntensiveB;
  }
  if (upperValue === "C") {
    return SemesterLength.IntensiveC;
  }
  if (upperValue === "D") {
    return SemesterLength.IntensiveD;
  }
  // eslint-disable-next-line no-console
  console.log(`Half of "${value}" is unreadable, defaulting to Full`);
  return SemesterLength.Full;
};

export const daysCase = (value: string) => {
  const days: Day[] = [];
  if (sunReg.test(value)) {
    days.push(Day.Sunday);
  }
  if (monReg.test(value)) {
    days.push(Day.Monday);
  }
  if (tuesReg.test(value)) {
    days.push(Day.Tuesday);
  }
  if (wedReg.test(value)) {
    days.push(Day.Wednesday);
  }
  if (thursReg.test(value)) {
    days.push(Day.Thursday);
  }
  if (friReg.test(value)) {
    days.push(Day.Friday);
  }
  if (satReg.test(value)) {
    days.push(Day.Saturday);
  }
  return days;
};

export const instructorCase = (value: string): string[] => {
  const instructors = value.split(/[;,\n]/);
  return instructors.map((instructor) => {
    return instructor.trim();
  });
};

export const sectionEndCase = (
  value: string,
  startSectionDate: string | undefined,
): SemesterLength => {
  const sectionStart = moment(startSectionDate, "l");
  const sectionEnd = moment(value, "l");
  const sectionLength = sectionEnd.diff(sectionStart, "days");
  const startMonth = sectionStart.month();
  const firstStartMonths = [0, 1, 7, 8]; // Jan, Feb, Aug, Sept
  if (sectionLength > MAX_HALF_LENGTH) {
    return SemesterLength.Full;
  }
  if (sectionLength > MIN_HALF_LENGTH && sectionLength <= MAX_HALF_LENGTH) {
    return firstStartMonths.includes(startMonth)
      ? SemesterLength.HalfFirst
      : SemesterLength.HalfSecond;
  }
  // TODO: Figure out if intensive is A, B, C, or D
  return SemesterLength.IntensiveA;
};

export const prefixCase = (value: string): string[] => {
  return value.replace(" ", "").split(/[;,]/);
};

export const numberDefaultZeroCase = (value: string): number => {
  return Number.isInteger(Number(value)) ? Number(value) : 0;
};

export const durationCase = (value: string): number => {
  if (Number.isInteger(Number(value))) {
    return Number(value);
  }
  const [startTime, endTime] = value.split(" ").join("").split("-");
  const startTimeMoment = moment(startTime, "h:mma");
  const endTimeMoment = moment(endTime, "h:mma");
  return endTimeMoment.diff(startTimeMoment, "minutes");
};

export const yearCase = (value: string): number | string => {
  return Number.isInteger(Number(value)) ? Number(value) : value;
};
