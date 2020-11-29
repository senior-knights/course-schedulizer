import { filter, isEqual } from "lodash";
import {
  Course,
  Half,
  Intensive,
  Schedule,
  Section,
  SemesterLength,
  SemesterLengthOption,
} from "utilities";

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
) => {
  const course = getCourse(schedule, prefixes, number);
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
