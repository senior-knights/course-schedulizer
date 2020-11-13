import forEach from "lodash/forEach";
import { Schedule } from "../interfaces/dataInterfaces";

// Get list of unique professors.
export const getProfs = (schedule: Schedule): string[] => {
  const professorsSet = new Set<string>();
  forEach(schedule.courses, (course) => {
    forEach(course.sections, (section) => {
      forEach(section.instructors, (prof) => {
        professorsSet.add(prof);
      });
    });
  });
  return [...professorsSet];
};
