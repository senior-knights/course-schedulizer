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

interface SpreadsheetSection {
  ampm: string;
  anticipatedSize: number;
  building: string;
  comments: string;
  days: di.Day[];
  duration: number;
  facultyHours: number;
  globalMax: number;
  half: di.Half;
  hourPart: string;
  instructors: di.Instructor[];
  letter: string;
  localMax: number;
  minPart: string;
  name: string;
  numHourPart: number;
  number: string;
  prefixes: string[];
  roomCapacity: number;
  roomNumber: string;
  startTime: string;
  studentHours: number;
  term: di.Term;
  year: number;
}

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

const convertToInterface = function convertToInterface(objects: papa.ParseResult<never>) {
  // Define variables for Schedule creation
  let sss: SpreadsheetSection;
  const schedule: di.Schedule = {
    sections: [],
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
  let regMatch: RegExpMatchArray | null;
  let roomParts: string[];
  let names: string[];
  let nameParts: string[];
  data.forEach((object) => {
    // Reset defaults
    sss = {
      ampm: "AM",
      anticipatedSize: 30,
      building: "",
      comments: "",
      days: [di.Day.Monday, di.Day.Wednesday, di.Day.Friday],
      duration: 50,
      facultyHours: 0,
      globalMax: 30,
      half: di.Half.Full,
      hourPart: "8",
      instructors: [],
      letter: "",
      localMax: 30,
      minPart: "00",
      name: "",
      numHourPart: 8,
      number: "",
      prefixes: [],
      roomCapacity: 30,
      roomNumber: "",
      startTime: "8:00 AM",
      studentHours: 0,
      term: di.Term.Fall,
      year: new Date().getFullYear(),
    };

    // Iterate through the fields of the CSV, and parse their values for this object
    usableFields.forEach((field) => {
      value = String(object[field]);
      switch (field) {
        case "name": {
          sss.name = value;
          break;
        }
        case "prefixes":
        case "prefix": {
          sss.prefixes = value.replace(" ", "").split(/[;,]/);
          break;
        }
        case "number": {
          sss.number = value;
          break;
        }
        case "section": {
          sss.letter = value;
          break;
        }
        case "studentHours": {
          sss.studentHours = Number(value);
          break;
        }
        case "facultyHours": {
          sss.facultyHours = Number(value);
          break;
        }
        case "startTimeStr":
        case "startTime": {
          // Look for a time
          regMatch = value.match(timeReg);
          if (regMatch != null && regMatch.length === 3) {
            // Get the hour and minute values, store as number and strings
            [, sss.hourPart, sss.minPart] = regMatch;
            sss.numHourPart = Number(sss.hourPart);

            // Handle high hour values
            if (sss.numHourPart > 11) {
              if (sss.numHourPart > 12) {
                // If military time, convert to standard
                sss.numHourPart -= 12;
                sss.hourPart = String(sss.numHourPart);
              }
              // Assume PM when 12:XX or military time
              sss.ampm = "PM";
            }

            // If hour is 0, assume military time of 12 AM
            if (sss.numHourPart === 0) {
              sss.hourPart = "12";
              sss.numHourPart = 12;
            }

            // Look to see whether AM or PM is specified explicitly
            if (pmReg.test(value)) {
              sss.ampm = "PM";
              if (amReg.test(value)) {
                // eslint-disable-next-line no-console
                console.log(`Time of "${value}" is labeled with AM and PM, defaulting to PM`);
              }
            } else if (amReg.test(value)) {
              sss.ampm = "AM";
            }

            // Piece the time together
            sss.startTime = `${sss.hourPart}:${sss.minPart} ${sss.ampm}`;
          } else {
            // eslint-disable-next-line no-console
            console.log(`Time of "${value}" is unreadable, defaulting to 8:00 AM`);
          }
          break;
        }
        case "duration": {
          sss.duration = Number(value);
          break;
        }
        case "location": {
          roomParts = value.trim().split(" ");
          if (roomParts.length === 1) {
            // No room number given
            [sss.building] = roomParts;
            sss.roomNumber = "";
          } else if (roomParts.length === 2) {
            // Building and room number given
            [sss.building, sss.roomNumber] = roomParts;
          } else {
            // Too many room parts given, assume last part is room number and rest is building
            sss.building = roomParts.slice(0, -1).join(" ");
            [sss.roomNumber] = roomParts.slice(-1);
          }
          break;
        }
        case "roomCapacity": {
          sss.roomCapacity = Number(value);
          break;
        }
        case "year": {
          sss.year = Number(value);
          break;
        }
        case "term": {
          if (fallReg.test(value)) {
            sss.term = di.Term.Fall;
          } else if (summerReg.test(value)) {
            sss.term = di.Term.Summer;
          } else if (springReg.test(value)) {
            sss.term = di.Term.Spring;
          } else if (interimReg.test(value)) {
            sss.term = di.Term.Interim;
          } else {
            // eslint-disable-next-line no-console
            console.log(`Term of "${value}" is unreadable, defaulting to Fall`);
          }
          break;
        }
        case "half": {
          if (firstReg.test(value)) {
            sss.half = di.Half.First;
          } else if (secondReg.test(value)) {
            sss.half = di.Half.Second;
          } else if (fullReg.test(value)) {
            sss.half = di.Half.Full;
          } else {
            // eslint-disable-next-line no-console
            console.log(`Half of "${value}" is unreadable, defaulting to Full`);
          }
          break;
        }
        case "days": {
          sss.days = [];
          if (sunReg.test(value)) {
            sss.days.push(di.Day.Sunday);
          }
          if (monReg.test(value)) {
            sss.days.push(di.Day.Monday);
          }
          if (tuesReg.test(value)) {
            sss.days.push(di.Day.Tuesday);
          }
          if (wedReg.test(value)) {
            sss.days.push(di.Day.Wednesday);
          }
          if (thursReg.test(value)) {
            sss.days.push(di.Day.Thursday);
          }
          if (friReg.test(value)) {
            sss.days.push(di.Day.Friday);
          }
          if (satReg.test(value)) {
            sss.days.push(di.Day.Saturday);
          }
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
          names = value.split(/[;,]/);
          names.forEach((name) => {
            nameParts = name.trim().split(" ");
            if (nameParts.length === 1) {
              // No last name given
              sss.instructors.push({
                firstName: nameParts[0],
                lastName: "",
              });
            } else if (nameParts.length === 2) {
              // First and last given
              sss.instructors.push({
                firstName: nameParts[0],
                lastName: nameParts[1],
              });
            } else {
              // Too many names given, assume first part is first name and rest is last name
              sss.instructors.push({
                firstName: nameParts[0],
                lastName: nameParts.slice(1).join(" "),
              });
            }
          });
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
      anticipatedSize: sss.anticipatedSize,
      comments: sss.comments,
      course: {
        facultyHours: sss.facultyHours,
        name: sss.name,
        number: sss.number,
        prefixes: sss.prefixes,
        studentHours: sss.studentHours,
      },
      facultyHours: sss.facultyHours,
      globalMax: sss.globalMax,
      half: sss.half,
      instructors: sss.instructors,
      letter: sss.letter,
      localMax: sss.localMax,
      meetings: [
        {
          days: sss.days,
          duration: sss.duration,
          location: {
            building: sss.building,
            roomCapacity: sss.roomCapacity,
            roomNumber: sss.roomNumber,
          },
          startTime: sss.startTime,
        },
      ], // TODO: Allow for multiple meetings
      studentHours: sss.studentHours,
      term: sss.term,
      year: sss.year,
    };
    schedule.sections.push(section);
  });
  return schedule;
};

export const readCSV = function readCSV() {
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
