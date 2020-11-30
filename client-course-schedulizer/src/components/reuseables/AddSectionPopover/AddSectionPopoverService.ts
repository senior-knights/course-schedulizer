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
import { array, object } from "yup";

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

// Remove false values from days array. Used by useForm()
export const schema = object().shape({
  days: array().transform((d) => {
    return d.filter((day: boolean | string) => {
      return day;
    });
  }),
});

/* Used to map the input from the popover form to the
 internal JSON object type.  */
export const mapInputToInternalTypes = (data: SectionInput) => {
  const location = locationCase(data.location);
  const semesterType = convertToSemesterLength(data.intensive || data.half || data.semesterLength);
  const newSection: Section = {
    anticipatedSize: Number(data.anticipatedSize),
    comments: data.comments,
    day10Used: 0,
    endDate: "",
    facultyHours: Number(data.facultyHours),
    globalMax: Number(data.globalMax),
    instructionalMethod: "LEC",
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
    startDate: "",
    status: "Active",
    studentHours: Number(data.studentHours),
    term: data.term,
    termStart: "",
    used: 0,
    year: "2021-2022",
  };

  const newCourse: Course = {
    department: "",
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
