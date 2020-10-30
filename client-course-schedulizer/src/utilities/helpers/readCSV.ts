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

const convertToInterface = function convertToInterface(objects: papa.ParseResult<never>) {
  // Define variables for Schedule creation
  let name: string;
  let prefixes: string[];
  let number: string;
  let letter: string;
  let studentHours: number;
  let facultyHours: number;
  let hourPart: string;
  let numHourPart: number;
  let minPart: string;
  let ampm: string;
  let startTime: string;
  let duration: number;
  let building: string;
  let roomNumber: string;
  let roomCapacity: number;
  let year: number;
  let term: di.Term;
  let half: di.Half;
  let days: di.Day[];
  let globalMax: number;
  let localMax: number;
  let anticipatedSize: number;
  let instructors: di.Instructor[];
  let comments: string;
  // eslint-disable-next-line prefer-const
  const schedule: di.Schedule = {
    sections: [],
  };

  // Get data and fields from the CSV
  const { data, meta } = objects;
  const { fields } = meta;

  // From the CSV fields, take the ones which we recognize
  // eslint-disable-next-line prefer-const
  let usableFields: string[] = [];
  let field;
  let startTimeIdx = -1;
  let startTimeStrIdx = -1;
  let instructorIdx = -1;
  let instructorsIdx = -1;
  let prefixIdx = -1;
  let prefixesIdx = -1;
  if (fields) {
    for (let i = 0; i < fields.length; i += 1) {
      field = fields[i];
      if (validFields.includes(field)) {
        usableFields.push(field);
        if (field === "startTime") {
          startTimeIdx = usableFields.length - 1;
        } else if (field === "startTimeStr") {
          startTimeStrIdx = usableFields.length - 1;
        } else if (field === "instructor") {
          instructorIdx = usableFields.length - 1;
        } else if (field === "instructors") {
          instructorsIdx = usableFields.length - 1;
        } else if (field === "prefix") {
          prefixIdx = usableFields.length - 1;
        } else if (field === "prefixes") {
          prefixesIdx = usableFields.length - 1;
        }
      }
    }
  }

  // If both "startTime" and "startTimeStr" are present, ignore "startTime"
  // This is because Pruim's data has a timestamp in "startTime" (not our timezone)
  if (startTimeIdx !== -1 && startTimeStrIdx !== -1) {
    usableFields.splice(startTimeIdx, 1);
  }
  // If both "instructor" and "instructors" are present, ignore "instructor"
  if (instructorIdx !== -1 && instructorsIdx !== -1) {
    usableFields.splice(instructorIdx, 1);
  }
  // If both "prefix" and "prefixes" are present, ignore "prefix"
  if (prefixIdx !== -1 && prefixesIdx !== -1) {
    usableFields.splice(prefixIdx, 1);
  }

  // Parse each row of the CSV as an object
  let object;
  let value: string;
  let regMatch: RegExpMatchArray | null;
  let roomParts: string[];
  let names: string[];
  let nameParts: string[];
  for (let i = 0; i < data.length; i += 1) {
    object = data[i];

    // Reset defaults
    name = "";
    prefixes = [];
    number = "";
    letter = "";
    studentHours = 0;
    facultyHours = 0;
    hourPart = "8";
    numHourPart = 8;
    minPart = "00";
    ampm = "AM";
    startTime = "8:00 AM";
    duration = 50;
    building = "";
    roomNumber = "";
    roomCapacity = 30;
    year = new Date().getFullYear();
    term = di.Term.Fall;
    half = di.Half.Full;
    days = [di.Day.Monday, di.Day.Wednesday, di.Day.Friday];
    globalMax = 30;
    localMax = 30;
    anticipatedSize = 30;
    instructors = [];
    comments = "";

    // Iterate through the fields of the CSV, and parse their values for this object
    for (let j = 0; j < usableFields.length; j += 1) {
      field = usableFields[j];
      if (field in object) {
        value = String(object[field]);
        switch (field) {
          case "name": {
            name = value;
            break;
          }
          case "prefixes":
          case "prefix": {
            prefixes = value.replace(" ", "").split(/[;,]/);
            break;
          }
          case "number": {
            number = value;
            break;
          }
          case "section": {
            letter = value;
            break;
          }
          case "studentHours": {
            studentHours = Number(value);
            break;
          }
          case "facultyHours": {
            facultyHours = Number(value);
            break;
          }
          case "startTimeStr":
          case "startTime": {
            // Look for a time
            regMatch = value.match(timeReg);
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
              startTime = `${hourPart}:${minPart} ${ampm}`;
            } else {
              // eslint-disable-next-line no-console
              console.log(`Time of "${value}" is unreadable, defaulting to 8:00 AM`);
            }
            break;
          }
          case "duration": {
            duration = Number(value);
            break;
          }
          case "location": {
            roomParts = value.trim().split(" ");
            if (roomParts.length === 1) {
              // No room number given
              [building] = roomParts;
              roomNumber = "";
            } else if (roomParts.length === 2) {
              // Building and room number given
              [building, roomNumber] = roomParts;
            } else {
              // Too many room parts given, assume last part is room number and rest is building
              building = roomParts.slice(0, -1).join(" ");
              [roomNumber] = roomParts.slice(-1);
            }
            break;
          }
          case "roomCapacity": {
            roomCapacity = Number(value);
            break;
          }
          case "year": {
            year = Number(value);
            break;
          }
          case "term": {
            if (fallReg.test(value)) {
              term = di.Term.Fall;
            } else if (summerReg.test(value)) {
              term = di.Term.Summer;
            } else if (springReg.test(value)) {
              term = di.Term.Spring;
            } else if (interimReg.test(value)) {
              term = di.Term.Interim;
            } else {
              // eslint-disable-next-line no-console
              console.log(`Term of "${value}" is unreadable, defaulting to Fall`);
            }
            break;
          }
          case "half": {
            if (firstReg.test(value)) {
              half = di.Half.First;
            } else if (secondReg.test(value)) {
              half = di.Half.Second;
            } else if (fullReg.test(value)) {
              half = di.Half.Full;
            } else {
              // eslint-disable-next-line no-console
              console.log(`Half of "${value}" is unreadable, defaulting to Full`);
            }
            break;
          }
          case "days": {
            days = [];
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
            break;
          }
          case "globalMax": {
            globalMax = Number(value);
            break;
          }
          case "localMax": {
            localMax = Number(value);
            break;
          }
          case "anticipatedSize": {
            anticipatedSize = Number(value);
            break;
          }
          case "instructors":
          case "instructor": {
            names = value.split(/[;,]/);
            for (let n = 0; n < names.length; n += 1) {
              nameParts = names[n].trim().split(" ");
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
            }
            break;
          }
          case "comments": {
            comments = value;
            break;
          }
          default: {
            break;
          }
        }
      }
    }

    // Create a section for this row of the CSV, and add it to the schedule
    const section: di.Section = {
      anticipatedSize,
      comments,
      course: {
        facultyHours,
        name,
        number,
        prefixes,
        studentHours,
      },
      facultyHours,
      globalMax,
      half,
      instructors,
      letter,
      localMax,
      meetings: [
        {
          days,
          duration,
          location: {
            building,
            roomCapacity,
            roomNumber,
          },
          startTime,
        },
      ], // TODO: Allow for multiple meetings
      studentHours,
      term,
      year,
    };
    schedule.sections.push(section);
  }
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
      console.log(convertToInterface(papa.parse(text, { header: true })));
    });
};
