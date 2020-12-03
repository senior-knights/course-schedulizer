import { camelCase, filter, indexOf, isEqual } from "lodash";
import { useContext } from "react";
import { DeepMap, FieldError } from "react-hook-form";
import { AppContext } from "utilities/contexts";
import {
  insertSectionCourse,
  instructorCase,
  locationCase,
  prefixCase,
  startTimeCase,
} from "utilities/helpers";
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

export const convertFromSemesterLength = (sl: SemesterLength | undefined): SemesterLengthOption => {
  if (sl === SemesterLength.Full || !sl) {
    return SemesterLengthOption.FullSemester;
  }
  if (sl === SemesterLength.HalfFirst || sl === SemesterLength.HalfSecond) {
    return SemesterLengthOption.HalfSemester;
  }

  return SemesterLengthOption.IntensiveSemester;
};

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

export const getSectionName = (course: Course, section: Section) => {
  return `${course.prefixes[0]}-${course.number}-${section.letter}`;
};

export const getCourse = (
  schedule: Schedule,
  prefixes: Course["prefixes"],
  courseNumber: Course["number"],
) => {
  const courses = filter(schedule.courses, (course) => {
    return isEqual(course.prefixes, prefixes) && course.number === courseNumber;
  });
  return courses.length > 0 ? courses[0] : undefined;
};

export const getSection = (
  schedule: Schedule,
  prefixes: Course["prefixes"],
  courseNumber: Course["number"],
  letter: Section["letter"],
  term: Section["term"],
) => {
  const course = getCourse(schedule, prefixes, courseNumber);
  const sections = filter(course?.sections, (section) => {
    return section.letter === letter && section.term === term;
  });
  return sections.length > 0 ? sections[0] : undefined;
};

export const removeSection = (
  schedule: Schedule,
  letter: Section["letter"],
  term: Section["term"],
  courseIndex: number,
) => {
  schedule.courses[courseIndex].sections = filter(
    schedule.courses[courseIndex].sections,
    (section) => {
      return section.letter !== letter || section.term !== term;
    },
  );
};

/* Used to map the input from the popover form to the
 internal JSON object type.  */
export const mapInputToInternalTypes = (data: SectionInput) => {
  const location = locationCase(data.location);
  const semesterType = convertToSemesterLength(data.intensive || data.half || data.semesterLength);
  const newSection: Section = createNewSectionFromInput(data, location, semesterType);

  const newCourse: Course = createNewCourseFromInput(data);
  return { newCourse, newSection };
};

interface MappedSection {
  newCourse: Course;
  newSection: Section;
}

export const useAddSectionToSchedule = () => {
  const {
    appState: { schedule },
    appDispatch,
    setIsCSVLoading,
  } = useContext(AppContext);

  // Update the schedule via pass by sharing.
  const addSectionToSchedule = (data: SectionInput) => {
    const { newSection, newCourse }: MappedSection = mapInputToInternalTypes(data);
    setIsCSVLoading(true);
    removeOldSection(schedule, newCourse, newSection);
    insertSectionCourse(schedule, newSection, newCourse);
    appDispatch({ payload: { schedule }, type: "setScheduleData" });
    setIsCSVLoading(false);
  };

  return { addSectionToSchedule };
};

// a helper to provide consistent naming and retrieve error messages
export const useInput = <T>(label: string, errors: DeepMap<T, FieldError>) => {
  const name = camelCase(label);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorMessage = (errors[name as keyof T] as any)?.message;
  return { errorMessage, name };
};

// Remove the old version of the Section if there is one
const removeOldSection = (schedule: Schedule, newCourse: Course, newSection: Section) => {
  const oldSection = getSection(
    schedule,
    newCourse.prefixes,
    newCourse.number,
    newSection.letter,
    newSection.term,
  );
  if (oldSection) {
    const oldCourse = getCourse(schedule, newCourse.prefixes, newCourse.number);
    const courseIndex = indexOf(schedule.courses, oldCourse);
    removeSection(schedule, newSection.letter, newSection.term, courseIndex);
  }
};

const createNewSectionFromInput = (
  data: SectionInput,
  location: string[],
  semesterType: SemesterLength,
): Section => {
  const building = location[0];
  const roomNumber = location[1];

  return {
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
          building,
          roomCapacity: Number(data.roomCapacity),
          roomNumber,
        },
        startTime: startTimeCase(data.startTime),
      },
    ],
    semesterLength: semesterType,
    studentHours: Number(data.studentHours),
    term: data.term,
    // TODO: there currently isn't a way to get the year for this Section.
    year: `${"hello"}`,
  };
};

const createNewCourseFromInput = (data: SectionInput): Course => {
  return {
    facultyHours: Number(data.facultyHours),
    name: data.name,
    number: data.number,
    prefixes: prefixCase(data.prefix),
    // The newSection will be added later in insertSectionCourse()
    sections: [],
    studentHours: Number(data.studentHours),
  };
};
