import { cloneDeep, forEach } from "lodash";
import moment from "moment";
import { emptyMeeting } from "utilities/constants";
import { Course, Day, Meeting, Section, SemesterLength, Term } from "utilities/interfaces";

export interface CaseCallbackParams {
  course: Course;
  meetings: Meeting[];
  section: Section;
}

export const MIN_HALF_LENGTH = 35;
export const MAX_HALF_LENGTH = 80;
const SEPARATORS = [",", ";", "\n"];

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

const createMeetings = (value: string, { meetings }: CaseCallbackParams): string[] => {
  const valueParts = value.split("\n");
  valueParts.forEach((_, i) => {
    if (meetings.length <= i) {
      // If there aren't enough meetings, create a new one
      meetings.push(cloneDeep(emptyMeeting));
    }
  });
  return valueParts;
};

const assignWithMeetings = (
  value: string,
  params: CaseCallbackParams,
  arrAssign: (value: string, i: number, arr: Meeting[]) => void,
) => {
  const valueParts = createMeetings(value, params);
  const { meetings } = params;
  valueParts.forEach((v, i) => {
    arrAssign(v, i, meetings);
  });
};

export const startTimeCallback = (value: string, params: CaseCallbackParams) => {
  assignWithMeetings(value, params, (startTime, i, meetings) => {
    meetings[i].startTime = startTimeCase(startTime);
  });
};

export const locationCallback = (value: string, params: CaseCallbackParams) => {
  assignWithMeetings(value, params, (location, i, meetings) => {
    [meetings[i].location.building, meetings[i].location.roomNumber] = locationCase(location);
  });
};

export const termCallback = (value: string, { section }: CaseCallbackParams) => {
  let separator = ",";
  if (
    SEPARATORS.some((s) => {
      separator = s;
      return value.includes(s);
    })
  ) {
    const terms = value.split(separator);
    const termsArr: Term[] = [];
    forEach(terms, (term) => {
      termsArr.push(termCase(term));
    });
    section.term = termsArr;
  } else {
    section.term = termCase(value);
  }
};

export const semesterLengthCallback = (value: string, { section }: CaseCallbackParams) => {
  section.semesterLength = semesterLengthCase(value);
};

export const daysCallback = (value: string, params: CaseCallbackParams) => {
  assignWithMeetings(value, params, (days, i, meetings) => {
    meetings[i].days = daysCase(days);
  });
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

export const durationCallback = (value: string, params: CaseCallbackParams) => {
  assignWithMeetings(value, params, (duration, i, meetings) => {
    meetings[i].duration = durationCase(duration);
  });
};

export const roomCapacityCallback = (value: string, params: CaseCallbackParams) => {
  assignWithMeetings(value, params, (capacity, i, meetings) => {
    meetings[i].location.roomCapacity = numberDefaultZeroCase(capacity);
  });
};

export const departmentCallback = (value: string, { course }: CaseCallbackParams) => {
  course.department = value;
};

export const termStartCallback = (value: string, { section }: CaseCallbackParams) => {
  section.termStart = value;
};

export const usedCallback = (value: string, { section }: CaseCallbackParams) => {
  section.used = numberDefaultZeroCase(value);
};

export const day10UsedCallback = (value: string, { section }: CaseCallbackParams) => {
  section.day10Used = numberDefaultZeroCase(value);
};

export const startDateCallback = (value: string, { section }: CaseCallbackParams) => {
  section.startDate = value;
};

export const endDateCallback = (value: string, { section }: CaseCallbackParams) => {
  section.endDate = value;
  section.semesterLength = endDateCase(value, section.startDate);
};

export const statusCallback = (value: string, { section }: CaseCallbackParams) => {
  section.status = value;
};

export const instructionalMethodCallback = (value: string, { section }: CaseCallbackParams) => {
  section.instructionalMethod = value;
};

export const sectionCallback = (value: string, params: CaseCallbackParams) => {
  if (value === "--" || value.trim() === "") {
    params.section.isNonTeaching = true;
  } else {
    const sectionParts = value.split("-");
    prefixCallback(sectionParts[0], params);
    numberCallback(sectionParts[1], params);
    letterCallback(sectionParts[2], params);
  }
};

export const timeCallback = (value: string, params: CaseCallbackParams) => {
  const [startTime] = value.split(" ").join("").split("-");
  startTimeCallback(startTime, params);
  durationCallback(value, params);
};

export const nonTeachingActivityCallback = (value: string, params: CaseCallbackParams) => {
  params.section.isNonTeaching = true;
  instructionalMethodCallback(value, params);
};

export const startTimeCase = (value: string): string => {
  const startMoment = moment(value, "h:mm A");
  return startMoment.isValid() ? startMoment.format("h:mm A") : "";
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

export const endDateCase = (
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
  return value.replace(" ", "").split(/[;,\n]/);
};

export const numberDefaultZeroCase = (value: string): number => {
  return Number.isInteger(Number(value)) ? Number(value) : 0;
};

export const durationCase = (value: string): number => {
  if (Number.isInteger(Number(value))) {
    return Number(value);
  }
  const [startTime, endTime] = value.split(" ").join("").split("-");
  const startTimeMoment = moment(startTime, "h:mmA");
  const endTimeMoment = moment(endTime, "h:mmA");
  return endTimeMoment.diff(startTimeMoment, "minutes");
};

export const yearCase = (value: string): number | string => {
  return Number.isInteger(Number(value)) ? Number(value) : value;
};
