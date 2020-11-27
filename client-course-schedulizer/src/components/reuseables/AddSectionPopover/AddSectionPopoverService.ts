import { camelCase } from "lodash";
import moment from "moment";
import { DeepMap, FieldError } from "react-hook-form";
import {
  insertSectionCourse,
  instructorCase,
  locationCase,
  prefixCase,
  startTimeCase,
} from "utilities";
import {
  Course,
  Half,
  Instructor,
  Intensive,
  Location,
  Meeting,
  Prefix,
  Schedule,
  Section,
  SemesterLength,
  SemesterLengthOption,
} from "utilities/interfaces";
import { array, number, object, string } from "yup";

// Defines interface for the section popover input
export interface SectionInput {
  anticipatedSize: Section["anticipatedSize"];
  comments: Section["comments"];
  days: Meeting["days"];
  duration: Meeting["duration"];
  facultyHours: Section["facultyHours"];
  globalMax: Section["globalMax"];
  half: Half;
  instructor: Instructor;
  intensive?: Intensive;
  localMax: Section["localMax"];
  location: string;
  name: Course["name"];
  number: Course["number"];
  prefix: Prefix;
  roomCapacity: Location["roomCapacity"];
  section: Section["letter"];
  semesterLength: SemesterLengthOption;
  startTime: Meeting["startTime"];
  studentHours: Section["studentHours"];
  term: Section["term"];
}

// A helpful function to convert the semester length from the input
export const convertToSemesterLength = (
  sl: Half | Intensive | SemesterLengthOption,
): SemesterLength => {
  switch (sl) {
    case Half.First:
      return SemesterLength.HalfFirst;
    case Half.Second:
      return SemesterLength.HalfSecond;
    case Intensive.A:
      return SemesterLength.IntensiveA;
    case Intensive.B:
      return SemesterLength.IntensiveB;
    case Intensive.C:
      return SemesterLength.IntensiveC;
    case Intensive.D:
      return SemesterLength.IntensiveD;
    default:
      return SemesterLength.Full;
  }
};

/* A schema to provide form validation for the AddSectionPopover.
NOTE: fields with default values are not check: semester and time. */
export const addSectionSchema = object().shape({
  anticipatedSize: number().typeError("global max must be a number").positive().integer(),
  courseName: string().required(),
  days: array()
    // Removes unchecked days from the list
    .transform((d) => {
      return d.filter((day: boolean | string) => {
        return day;
      });
    })
    .min(1),
  duration: number().typeError("duration must be a number").required().positive().integer(),
  facultyHours: number()
    .typeError("faculty hours must be a number")
    .required()
    .positive()
    .integer(),
  globalMax: number().typeError("global max must be a number").positive().integer(),
  instructor: string().required(),
  localMax: number().typeError("global max must be a number").positive().integer(),
  location: string().required(),
  number: number().typeError("number must be a number").required().positive().integer(),
  prefix: string().required().uppercase(),
  roomCapacity: number().typeError("global max must be a number").positive().integer(),
  section: string().required().uppercase(),
  studentHours: number()
    .typeError("student hours must be a number")
    .required()
    .positive()
    .integer(),
});

/* Used to map the input from the popover form to the
 internal JSON object type.  */
export const mapInputToInternalTypes = (data: SectionInput) => {
  const location = locationCase(data.location);
  const semesterType = convertToSemesterLength(data.intensive || data.half || data.semesterLength);
  const newSection: Section = {
    anticipatedSize: Number(data.anticipatedSize),
    comments: data.comments,
    facultyHours: Number(data.facultyHours),
    globalMax: Number(data.globalMax),
    instructors: instructorCase(data.instructor),
    letter: data.section,
    localMax: Number(data.localMax),
    meetings: [
      {
        days: data.days,
        duration: Number(data.duration),
        location: {
          building: location[0],
          roomCapacity: Number(data.roomCapacity),
          roomNumber: location[1],
        },
        startTime: startTimeCase(data.startTime),
      },
    ],
    semesterLength: semesterType,
    studentHours: Number(data.studentHours),
    term: data.term,
    year: `${moment().year()}-${moment().add(1, "year").year()}`,
  };

  const newCourse: Course = {
    facultyHours: Number(data.facultyHours),
    name: data.name,
    number: data.number,
    prefixes: prefixCase(data.prefix),
    // The newSection will be added later in insertSectionCourse()
    sections: [],
    studentHours: Number(data.studentHours),
  };
  return { newCourse, newSection };
};

// Update the schedule via pass by sharing.
export const updateScheduleWithNewSection = (data: SectionInput, schedule: Schedule) => {
  const {
    newSection,
    newCourse,
  }: { newCourse: Course; newSection: Section } = mapInputToInternalTypes(data);

  // Insert the Section to the Schedule, either as a new Course or to an existing Course
  insertSectionCourse(schedule, newSection, newCourse);
};

// a helper to provide consistent naming and retrieve error messages
export const useInput = <T>(label: string, errors: DeepMap<T, FieldError>) => {
  const name = camelCase(label);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorMessage = (errors[name as keyof T] as any)?.message;
  return { errorMessage, name };
};
