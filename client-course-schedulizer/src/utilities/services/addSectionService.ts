import { filter, indexOf, isEqual } from "lodash";
import {
  instructorCase,
  locationCase,
  prefixCase,
  startTimeCase,
  yearCase,
} from "utilities/helpers";
import {
  Course,
  CourseSectionMeeting,
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
  Term,
} from "utilities/interfaces";

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
  halfSemester: Half;
  instructionalMethod: Section["instructionalMethod"];
  instructor: Instructor;
  intensiveSemester?: Intensive;
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

export interface NonTeachingLoadInput {
  activity: Section["instructionalMethod"];
  facultyHours: Section["facultyHours"];
  instructor: Instructor;
  terms: Term[];
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

const convertToSemesterLength = (sl: Half | Intensive | SemesterLengthOption): SemesterLength => {
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
  instructors: Section["instructors"],
) => {
  const course = getCourse(schedule, prefixes, courseNumber);
  const sections = filter(course?.sections, (section) => {
    return (
      section.letter === letter &&
      section.term === term &&
      isEqual(section.instructors, instructors)
    );
  });
  return sections.length > 0 ? sections[0] : undefined;
};

const removeSection = (
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
  // TODO: Delete course if no sections left?
};

/* Used to map the input from the popover form to the
 internal JSON object type.  */
export const mapInputToInternalTypes = (data: SectionInput) => {
  const newSection: Section = createNewSectionFromInput(data);
  const newCourse: Course = createNewCourseFromInput(data);

  return { newCourse, newSection };
};

const createNewSectionFromInput = (data: SectionInput): Section => {
  const location = locationCase(data.location);
  const semesterType = convertToSemesterLength(
    data.intensiveSemester || data.halfSemester || data.semesterLength,
  );

  const building = location[0];
  const roomNumber = location[1];

  return {
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
          building,
          roomCapacity: Number(data.roomCapacity),
          roomNumber,
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
};

const createNewCourseFromInput = (data: SectionInput): Course => {
  return {
    department: data.department,
    facultyHours: Number(data.facultyHours),
    name: data.name,
    number: data.number,
    prefixes: prefixCase(data.prefix),
    // The newSection will be added later in insertSectionCourse()
    sections: [],
    studentHours: Number(data.studentHours),
  };
};

// If there is an old version of the Section...
export const handleOldSection = (
  oldData: CourseSectionMeeting | undefined,
  newSection: Section,
  removeOldSection: boolean,
  schedule: Schedule,
) => {
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
    if (removeOldSection) {
      removeSectionFromSchedule(oldData, schedule, oldSection);
    }
  }
};

export const removeSectionFromSchedule = (
  data: CourseSectionMeeting | undefined,
  schedule: Schedule,
  section: Section,
) => {
  const oldCourse = data?.course;
  const courseIndex = indexOf(schedule.courses, oldCourse);
  removeSection(schedule, section.letter, section.term, section.instructors, courseIndex);
};
