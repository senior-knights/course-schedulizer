import { filter, indexOf, isEqual } from "lodash";
import {
  Course,
  CourseSectionMeeting,
  Half,
  insertSectionCourse,
  instructorCase,
  Intensive,
  locationCase,
  prefixCase,
  Schedule,
  Section,
  SemesterLength,
  SemesterLengthOption,
  startTimeCase,
  yearCase,
} from "utilities";
import { Instructor, Location, Meeting, Prefix } from "utilities/interfaces";
import { array, object } from "yup";

// Defines interface for the section popover input
export interface SectionInput {
  anticipatedSize: Section["anticipatedSize"];
  comments: Section["comments"];
  day10Used: Section["day10Used"];
  days: Meeting["days"];
  department: Course["department"];
  duration: Meeting["duration"];
  facultyHours: Section["facultyHours"];
  globalMax: Section["globalMax"];
  half: Half;
  instructionalMethod: Section["instructionalMethod"];
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
  status: Section["status"];
  studentHours: Section["studentHours"];
  term: Section["term"];
  used: Section["used"];
  year: string; // Assume string till yearCase() decides
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

// Remove false values from days array. Used by useForm()
export const schema = object().shape({
  days: array().transform((d) => {
    return d.filter((day: boolean | string) => {
      return day;
    });
  }),
});

export const getSectionName = (course: Course, section: Section) => {
  return `${course.prefixes[0]}-${course.number}-${section.letter}`;
};

export const getCourse = (
  schedule: Schedule,
  prefixes: Course["prefixes"],
  number: Course["number"],
) => {
  const courses = filter(schedule.courses, (course) => {
    return isEqual(course.prefixes, prefixes) && course.number === number;
  });
  return courses.length > 0 ? courses[0] : undefined;
};

export const getSection = (
  schedule: Schedule,
  prefixes: Course["prefixes"],
  number: Course["number"],
  letter: Section["letter"],
  term: Section["term"],
  instructors: Section["instructors"],
) => {
  const course = getCourse(schedule, prefixes, number);
  const sections = filter(course?.sections, (section) => {
    return (
      section.letter === letter && section.term === term && section.instructors === instructors
    );
  });
  return sections.length > 0 ? sections[0] : undefined;
};

export const removeSection = (
  schedule: Schedule,
  letter: Section["letter"],
  term: Section["term"],
  instructors: Section["instructors"],
  courseIndex: number,
) => {
  schedule.courses[courseIndex].sections = filter(
    schedule.courses[courseIndex].sections,
    (section) => {
      return (
        section.letter !== letter || section.term !== term || section.instructors !== instructors
      );
    },
  );
};

/* Used to map the input from the popover form to the
 internal JSON object type.  */
export const mapInputToInternalTypes = (data: SectionInput) => {
  const location = locationCase(data.location);
  const semesterType = convertToSemesterLength(data.intensive || data.half || data.semesterLength);
  const newSection: Section = {
    anticipatedSize: Number(data.anticipatedSize),
    comments: data.comments,
    day10Used: Number(data.day10Used),
    endDate: "",
    facultyHours: Number(data.facultyHours),
    globalMax: Number(data.globalMax),
    instructionalMethod: data.instructionalMethod,
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
    status: data.status,
    studentHours: Number(data.studentHours),
    term: data.term,
    termStart: "",
    used: Number(data.used),
    year: yearCase(data.year),
  };

  const newCourse: Course = {
    department: data.department,
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
export const updateScheduleWithNewSection = (
  data: SectionInput,
  schedule: Schedule,
  oldData: CourseSectionMeeting | undefined,
) => {
  const {
    newSection,
    newCourse,
  }: { newCourse: Course; newSection: Section } = mapInputToInternalTypes(data);

  // If there is an old version of the Section...
  const oldSection = oldData?.section;
  if (oldSection) {
    // If the year, term, and semester length haven't changed...
    if (
      String(newSection.year) === String(oldSection.year) &&
      newSection.term === oldSection.term &&
      newSection.semesterLength === oldSection.semesterLength
    ) {
      // Update the new Section to match the date fields of the old Section
      newSection.termStart = oldSection.termStart;
      newSection.startDate = oldSection.startDate;
      newSection.endDate = oldSection.endDate;
    }

    // Remove the old version of the Section
    const oldCourse = oldData?.course;
    const courseIndex = indexOf(schedule.courses, oldCourse);
    removeSection(
      schedule,
      oldSection.letter,
      oldSection.term,
      oldSection.instructors,
      courseIndex,
    );
  }

  // Insert the Section to the Schedule, either as a new Course or to an existing Course
  insertSectionCourse(schedule, newSection, newCourse);
};
