import { filter } from "lodash";
import { CourseSectionMeeting, emptyMeeting, Schedule, Term } from "utilities";

export const findSection = (
  schedule: Schedule,
  sectionName: string,
  term: Term,
): CourseSectionMeeting => {
  const [prefix, number, letter] = sectionName.split("-");
  const [course] = filter(schedule.courses, (c) => {
    return c.prefixes.includes(prefix) && c.number === number;
  });
  const [section] = filter(course.sections, (s) => {
    return s.letter === letter && s.term === term;
  });
  return {
    course,
    meeting: section.meetings ? section.meetings[0] : emptyMeeting,
    section,
  };
};
