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

const convertToInterface = function convertToInterface(objects: papa.ParseResult<never>) {
  let object;
  let field;
  let value;
  // Define variables for Schedule creation
  let name: string;
  let prefix: string;
  let number: string;
  let letter: string;
  let studentHours: number;
  let facultyHours: number;
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
  const { data, meta } = objects;
  const { fields } = meta;
  console.log(data);
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
  for (let i = 0; i < data.length; i += 1) {
    object = data[i];
    // Reset defaults
    name = "";
    prefix = "";
    number = "";
    letter = "";
    studentHours = 0;
    facultyHours = 0;
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
    for (let j = 0; j < usableFields.length; j += 1) {
      field = usableFields[j];
      if (field in object) {
        value = object[field];
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
            startTime = "8:00 AM";
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
            // TODO: Regex look for [Mm], [Tt]^[Hh], [Ww], [Tt][Hh]/[Rr], [Ff], [Ss]^[Uu], [Ss][Uu]/[Nn]
            days = [di.Day.Monday, di.Day.Wednesday, di.Day.Friday];
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
