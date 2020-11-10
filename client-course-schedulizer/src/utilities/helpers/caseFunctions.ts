import * as di from "../interfaces/dataInterfaces";

export interface CaseCallbackParams {
  course: di.Course;
  firstMeeting: di.Meeting;
  section: di.Section;
}

// Define regexes for parsing
const timeReg = RegExp("(?<![1-9])(1[0-9]|2[0-3]|[0-9]):([0-5][0-9])");
const amReg = RegExp("[Aa][Mm]");
const pmReg = RegExp("[Pp][Mm]");
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
  firstMeeting.duration = numberDefaultZeroCase(value);
};

export const roomCapacityCallback = (value: string, { firstMeeting }: CaseCallbackParams) => {
  firstMeeting.location.roomCapacity = numberDefaultZeroCase(value);
};

export const startTimeCase = (value: string): string => {
  let ampm = "AM";
  let hourPart = "8";
  let numHourPart = 8;
  let minPart = "00";
  const regMatch = value.match(timeReg);
  if (regMatch != null && regMatch.length === 3) {
    // Get the hour and minute values, store as number and strings
    [, hourPart, minPart] = regMatch;
    numHourPart = Number(hourPart);

    // Handle high hour values
    if (numHourPart > 11) {
      if (numHourPart > 12) {
        // If military time, convert to standard
        numHourPart -= 12;
        hourPart = String(numHourPart);
      }
      // Assume PM when 12:XX or military time
      ampm = "PM";
    }

    // If hour is 0, assume military time of 12 AM
    else if (numHourPart === 0) {
      hourPart = "12";
      numHourPart = 12;
    }

    // Look to see whether AM or PM is specified explicitly
    if (pmReg.test(value)) {
      ampm = "PM";
      if (amReg.test(value)) {
        // eslint-disable-next-line no-console
        console.log(`Time of "${value}" is labeled with AM and PM, defaulting to PM`);
      }
    } else if (amReg.test(value)) {
      ampm = "AM";
    }

    // Piece the time together
    return `${hourPart}:${minPart} ${ampm}`;
  }
  if (value === "") {
    return "ASYNC";
  }
  // eslint-disable-next-line no-console
  console.log(`Time of "${value}" is unreadable, defaulting to 8:00 AM`);
  return "8:00 AM";
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

export const termCase = (value: string): di.Term => {
  if (fallReg.test(value)) {
    return di.Term.Fall;
  }
  if (summerReg.test(value)) {
    return di.Term.Summer;
  }
  if (springReg.test(value)) {
    return di.Term.Spring;
  }
  if (interimReg.test(value)) {
    return di.Term.Interim;
  }
  // eslint-disable-next-line no-console
  console.log(`Term of "${value}" is unreadable, defaulting to Fall`);
  return di.Term.Fall;
};

export const semesterLengthCase = (value: string): di.SemesterLength => {
  const upperValue = value.toUpperCase();
  const lowerValue = value.toLowerCase();
  if (lowerValue === "first") {
    return di.SemesterLength.HalfFirst;
  }
  if (lowerValue === "second") {
    return di.SemesterLength.HalfSecond;
  }
  if (lowerValue === "full") {
    return di.SemesterLength.Full;
  }
  if (upperValue === "A") {
    return di.SemesterLength.IntensiveA;
  }
  if (upperValue === "B") {
    return di.SemesterLength.IntensiveB;
  }
  if (upperValue === "C") {
    return di.SemesterLength.IntensiveC;
  }
  if (upperValue === "D") {
    return di.SemesterLength.IntensiveD;
  }
  // eslint-disable-next-line no-console
  console.log(`Half of "${value}" is unreadable, defaulting to Full`);
  return di.SemesterLength.Full;
};

export const daysCase = (value: string) => {
  const days: di.Day[] = [];
  if (sunReg.test(value)) {
    days.push(di.Day.Sunday);
  }
  if (monReg.test(value)) {
    days.push(di.Day.Monday);
  }
  if (tuesReg.test(value)) {
    days.push(di.Day.Tuesday);
  }
  if (wedReg.test(value)) {
    days.push(di.Day.Wednesday);
  }
  if (thursReg.test(value)) {
    days.push(di.Day.Thursday);
  }
  if (friReg.test(value)) {
    days.push(di.Day.Friday);
  }
  if (satReg.test(value)) {
    days.push(di.Day.Saturday);
  }
  return days;
};

export const instructorCase = (value: string): di.Instructor[] => {
  const names = value.split(/[;,\n]/);
  const instructors: di.Instructor[] = [];
  names.forEach((name) => {
    const nameParts = name.trim().split(" ");
    if (nameParts.length === 1) {
      // No last name given
      instructors.push({
        firstName: nameParts[0],
        lastName: "",
      });
    } else if (nameParts.length === 2) {
      // First and last given
      instructors.push({
        firstName: nameParts[0],
        lastName: nameParts[1],
      });
    } else {
      // Too many names given, assume first part is first name and rest is last name
      instructors.push({
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(" "),
      });
    }
  });
  return instructors;
};

export const prefixCase = (value: string): string[] => {
  return value.replace(" ", "").split(/[;,]/);
};

export const numberDefaultZeroCase = (value: string): number => {
  return Number.isInteger(Number(value)) ? Number(value) : 0;
};

export const yearCase = (value: string): number | string => {
  return Number.isInteger(Number(value)) ? Number(value) : value;
};
