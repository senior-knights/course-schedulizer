import papa from "papaparse";
import * as di from "../interfaces/dataInterfaces";

// For now the plan is to assume the CSV has these proper headers
const validFields = [
  "name",
  // If both are found, use "prefixes"
  "prefix",
  "prefixes",
  "number",
  // Corresponds to letter
  "section",
  "studentHours",
  "facultyHours",
  // If both are found, use "startTimeStr"
  "startTime",
  "startTimeStr",
  "duration",
  // Covers both building and room number
  "location",
  "roomCapacity",
  "year",
  "term",
  "half",
  // Needs to be parsed
  "days",
  "globalMax",
  "localMax",
  "anticipatedSize",
  // If both are found, use "instructors"
  "instructor",
  "instructors",
  "comments",
];

// Define regexes for parsing
const timeReg = RegExp("(?<![1-9])(1[0-9]|2[0-3]|[0-9]):([0-5][0-9])");
const amReg = RegExp("[Aa][Mm]");
const pmReg = RegExp("[Pp][Mm]");
const fallReg = RegExp("[Ff]");
const summerReg = RegExp("[Ss][Uu]");
const springReg = RegExp("[Ss]");
// "W" represents interim in Pruim's system it seems
const interimReg = RegExp("[Ii]|[Ww]");
const firstReg = RegExp("[Ff]irst");
const secondReg = RegExp("[Ss]econd");
const fullReg = RegExp("[Ff]ull");
const sunReg = RegExp("[Ss][Uu]|[Nn]");
const monReg = RegExp("[Mm]");
const tuesReg = RegExp("[Tt](?![Hh])");
const wedReg = RegExp("[Ww]");
const thursReg = RegExp("[Tt][Hh]|[Rr]");
const friReg = RegExp("[Ff]");
const satReg = RegExp("[Ss](?![Uu])");

const startTimeCase = (value: string): string => {
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
    if (numHourPart === 0) {
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
  // eslint-disable-next-line no-console
  console.log(`Time of "${value}" is unreadable, defaulting to 8:00 AM`);
  return "8:00 AM";
};

const locationCase = (value: string): string[] => {
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

const termCase = (value: string): di.Term => {
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

const halfCase = (value: string): di.SemesterLength => {
  if (firstReg.test(value)) {
    return di.SemesterLength.HalfFirst;
  }
  if (secondReg.test(value)) {
    return di.SemesterLength.HalfSecond;
  }
  if (fullReg.test(value)) {
    return di.SemesterLength.Full;
  }
  // eslint-disable-next-line no-console
  console.log(`Half of "${value}" is unreadable, defaulting to Full`);
  return di.SemesterLength.Full;
};

const daysCase = (value: string): di.Day[] => {
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

const instructorCase = (value: string): di.Instructor[] => {
  const names = value.split(/[;,]/);
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

const convertToInterface = (objects: papa.ParseResult<never>) => {
  // Define variables for Schedule creation
  let sss: di.Section;
  const schedule: di.Schedule = {
    courses: [],
  };

  // Get data and fields from the CSV
  const { data, meta } = objects;
  const { fields } = meta;

  // From the CSV fields, take the ones which we recognize
  let usableFields: string[] = [];
  const duplicates = [
    ["startTime", "startTimeStr"],
    ["prefix", "prefixes"],
    ["instructor", "instructors"],
  ];
  if (fields) {
    usableFields = fields.filter((field) => {
      return validFields.includes(field);
    });
  }
  // Remove the duplicate field names
  // If both "startTime" and "startTimeStr" are present, ignore "startTime"
  // This is because Pruim's data has a timestamp in "startTime" (not our timezone)
  // If both "instructor" and "instructors" are present, ignore "instructor"
  // If both "prefix" and "prefixes" are present, ignore "prefix"
  duplicates.forEach((duplicate) => {
    if (usableFields.includes(duplicate[0]) && usableFields.includes(duplicate[1])) {
      usableFields.splice(usableFields.indexOf(duplicate[0]), 1);
    }
  });

  // Parse each row of the CSV as an object
  let value: string;
  data.forEach((object) => {
    // Reset defaults
    sss = {
      anticipatedSize: 30,
      comments: "",
      globalMax: 30,
      instructors: [],
      letter: "",
      localMax: 30,
      meetings: [
        {
          days: [di.Day.Monday, di.Day.Wednesday, di.Day.Friday],
          duration: 50,
          location: { building: "", roomCapacity: 30, roomNumber: "" },
          startTime: "8:00 AM",
        },
      ],
      semesterLength: di.SemesterLength.Full,
      term: di.Term.Fall,
      year: new Date().getFullYear(),
    };

    const { meetings } = sss;
    const course: di.Course = {
      facultyHours: 0,
      name: "",
      number: "",
      prefixes: [],
      sections: [],
      studentHours: 0,
    };
    const firstMeeting = meetings[0];

    // Iterate through the fields of the CSV, and parse their values for this object
    usableFields.forEach((field) => {
      value = String(object[field]);
      switch (field) {
        case "name": {
          course.name = value;
          break;
        }
        case "prefixes":
        case "prefix": {
          course.prefixes = value.replace(" ", "").split(/[;,]/);
          break;
        }
        case "number": {
          course.number = value;
          break;
        }
        case "section": {
          sss.letter = value;
          break;
        }
        case "studentHours": {
          course.studentHours = Number(value);
          break;
        }
        case "facultyHours": {
          course.facultyHours = Number(value);
          break;
        }
        case "startTimeStr":
        case "startTime": {
          firstMeeting.startTime = startTimeCase(value);
          break;
        }
        case "duration": {
          firstMeeting.duration = Number(value);
          break;
        }
        case "location": {
          [firstMeeting.location.building, firstMeeting.location.roomNumber] = locationCase(value);
          break;
        }
        case "roomCapacity": {
          firstMeeting.location.roomCapacity = Number(value);
          break;
        }
        case "year": {
          sss.year = Number(value);
          break;
        }
        case "term": {
          sss.term = termCase(value);
          break;
        }
        case "half": {
          sss.semesterLength = halfCase(value);
          break;
        }
        case "days": {
          firstMeeting.days = daysCase(value);
          break;
        }
        case "globalMax": {
          sss.globalMax = Number(value);
          break;
        }
        case "localMax": {
          sss.localMax = Number(value);
          break;
        }
        case "anticipatedSize": {
          sss.anticipatedSize = Number(value);
          break;
        }
        case "instructors":
        case "instructor": {
          sss.instructors = instructorCase(value);
          break;
        }
        case "comments": {
          sss.comments = value;
          break;
        }
        default: {
          break;
        }
      }
    });

    // Create a section for this row of the CSV, and add it to the schedule
    const section: di.Section = {
      // TODO: Allow for multiple meetings
      ...sss,
    };

    // Check if there is already a course in the schedule with the same prefix and number
    const existingCourse: di.Course[] = schedule.courses.filter((c) => {
      return (
        c.prefixes.every((p) => {
          return course.prefixes.includes(p);
        }) && c.number === course.number
      );
    });

    // If there is, add the new section to that course
    if (existingCourse.length > 0) {
      schedule.courses[schedule.courses.indexOf(existingCourse[0])].sections.push(section);
    }
    // Otherwise, add the new course to the schedule
    else {
      course.sections.push(section);
      schedule.courses.push(course);
    }
  });
  return schedule;
};

export const readCSV = () => {
  // Referenced https://jscharting.com/tutorials/js-chart-data/client-side/fetch-csv-and-json/
  fetch("modelSchedule.csv")
    .then((response) => {
      return response.text();
    })
    .then((text) => {
      // eslint-disable-next-line no-console
      console.log(convertToInterface(papa.parse(text, { header: true, skipEmptyLines: true })));
    });
};
