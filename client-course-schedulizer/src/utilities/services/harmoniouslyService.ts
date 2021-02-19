import { Schedule } from "utilities";

// get list of unique classes
export const getClasses = (schedule: Schedule): string[] => {
  const coursesSet = new Set<string>();
  schedule.courses.forEach((course) => {
    const {
      number,
      prefixes: [firstPrefix],
      sections,
    } = course;
    sections.forEach((section) => {
      const { letter } = section;
      coursesSet.add(`${firstPrefix}${number}${letter}`);
    });
  });
  return [...coursesSet];
};
