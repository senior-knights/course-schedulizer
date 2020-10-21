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
  let anticipatedSize: number;
  let comments: string;
  const schedule: di.Section[] = [];
  const { data, meta } = objects;
  const { fields } = meta;
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
    anticipatedSize = 30;
    comments = "";
    for (let j = 0; j < usableFields.length; j += 1) {
      field = usableFields[j];
      if (field in object) {
        value = object[field];
        switch (field) {
          case "name": {
            name = "";
            break;
          }
          case "prefix": {
            prefix = "";
            break;
          }
          case "number": {
            number = "";
            break;
          }
          case "section": {
            letter = "";
            break;
          }
          case "studentHours": {
            studentHours = 0;
            break;
          }
          case "facultyHours": {
            facultyHours = 0;
            break;
          }
          case "startTime": {
            startTime = "8:00 AM";
            break;
          }
          case "duration": {
            duration = 0;
            break;
          }
          case "location": {
            building = "";
            roomNumber = "";
            break;
          }
          case "roomCapacity": {
            roomCapacity = 30;
            break;
          }
          case "year": {
            year = new Date().getFullYear();
            break;
          }
          case "term": {
            term = di.Term.Fall;
            break;
          }
          case "half": {
            half = di.Half.Full;
            break;
          }
          case "days": {
            days = [di.Day.Monday, di.Day.Wednesday, di.Day.Friday];
            break;
          }
          case "globalMax": {
            globalMax = 30;
            break;
          }
          case "anticipatedSize": {
            anticipatedSize = 30;
            break;
          }
          case "comments": {
            comments = "";
            break;
          }
          default: {
            break;
          }
        }
      }
    }
    // TODO: Construct a Section here, and add it to schedule
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
