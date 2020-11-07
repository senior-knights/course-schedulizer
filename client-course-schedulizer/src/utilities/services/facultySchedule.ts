import { Schedule } from "../interfaces/dataInterfaces";

// Get list of unique professors.
export const getProfs = (schedule: Schedule): string[] => {
  const professors: string[] = [];
  schedule.courses.map((course) => {
    return course.sections.map((section) => {
      return section.instructors.forEach((prof) => {
        if (!professors.includes(prof.lastName)) {
          professors.push(prof.lastName);
        }
      });
    });
  });
  return professors;
};
