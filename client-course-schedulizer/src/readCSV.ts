import papa from "papaparse";
import * as di from "./dataInterfaces";

// For now the plan is to assume the CSV has these proper headers
const validFields = [
  "name",
  "prefix",
  "number",
  // Corresponds to letter
  "section",
  "studentHours",
  "facultyHours",
  "startTime",
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
  "comments",
];

// Define regexes for parsing
const sunReg = RegExp("[Ss][Uu]|[Nn]");
const monReg = RegExp("[Mm]");
const tuesReg = RegExp("[Tt](?![Hh])");
const wedReg = RegExp("[Ww]");
const thursReg = RegExp("[Tt][Hh]|[Rr]");
const friReg = RegExp("[Ff]");
const satReg = RegExp("[Ss](?![Uu])");
const timeReg = RegExp("([0-2][0-9]):([0-5][0-9])");
const amReg = RegExp("[Aa][Mm]");
const pmReg = RegExp("[Pp][Mm]");

const convertToInterface = function convertToInterface(objects: papa.ParseResult<never>) {
  // Define variables to store info when iterating
  let object;
  let field;
  let value: string;
  let regMatch: RegExpMatchArray | null;

  // Define variables for Schedule creation
  let name: string;
  let prefix: string;
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
  let comments: string;
  // eslint-disable-next-line prefer-const
  const schedule: di.Schedule = {
    sections: [],
  };

  // Get data and fields from the CSV
  const { data, meta } = objects;
  const { fields } = meta;
  console.log(data);

  // From the CSV fields, take the ones which we recognize
  // eslint-disable-next-line prefer-const
  let usableFields: string[] = [];
  if (fields) {
    for (let i = 0; i < fields.length; i += 1) {
      field = fields[i];
      if (validFields.includes(field)) {
        usableFields.push(field);
      }
    }
  }

  // Parse each row of the CSV as an object
  for (let i = 0; i < data.length; i += 1) {
    object = data[i];

    // Reset defaults
    name = "";
    prefix = "";
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
          case "prefix": {
            prefix = value;
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
          case "startTime": {
            // TODO
            regMatch = value.match(timeReg);
            if (regMatch != null && regMatch.length === 3) {
              [, hourPart, minPart] = regMatch;
              numHourPart = Number(hourPart);
              if (numHourPart === 0) {
                hourPart = "12";
                numHourPart = 12;
              }
              if (numHourPart > 12) {
                if (numHourPart > 23) {
                  console.log(`Time of "${value}" is nonsensical, defaulting to 8:00 AM`);
                  break;
                }
              }
              // TODO: Continue
              startTime = `${hourPart}:${minPart} ${ampm}`;
            } else {
              console.log(`Time of "${value}" is unreadable, defaulting to 8:00 AM`);
            }
            break;
          }
          case "duration": {
            duration = Number(value);
            break;
          }
          case "location": {
            // TODO: Explode at space?
            building = "";
            roomNumber = "";
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
            // TODO: Regex look for [Ff]([Aa])/(all), [Ss]([Pp])/(pring), ...
            term = di.Term.Fall;
            break;
          }
          case "half": {
            // TODO
            half = di.Half.Full;
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
    /* TODO
    let section: di.Section = {
      "anticipatedSize": anticipatedSize,
      "comments": comments,
      "course": course, // TODO
      "facultyHours": facultyHours,
      "globalMax": globalMax,
      "half": half,
      "instructors": instructor, // TODO
      "letter": letter,
      "localMax": localMax,
      "meetings": Meeting[], // TODO
      "studentHours": studentHours,
      "term": term,
      "year": year,
    }
    schedule.sections.push(section);
    */
  }
  return schedule;
};

export const readCSV = function readCSV() {
  // Referenced https://jscharting.com/tutorials/js-chart-data/client-side/fetch-csv-and-json/
  // TODO: Construct a better test file (with all fields)
  fetch("data.csv")
    .then((response) => {
      return response.text();
    })
    .then((text) => {
      // eslint-disable-next-line no-console
      console.log(convertToInterface(papa.parse(text, { header: true })));
    });
};
