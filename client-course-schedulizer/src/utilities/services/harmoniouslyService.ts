import { Schedule, Section } from "utilities";

/** A special data type used in Harmony. Ideally, this would just
 *   use the same interfaces as the Schedulizer. Having it separate increases complexity.
 */
export interface HarmonyClass {
  instructors: Section["instructors"];
  name: string;
}

// get list of unique classes
export const getClasses = (schedule: Schedule): HarmonyClass[] => {
  const coursesSet = new Set<HarmonyClass>();
  schedule.courses.forEach((course) => {
    const {
      number,
      prefixes: [firstPrefix],
      sections,
    } = course;
    sections.forEach((section) => {
      const { letter, instructors } = section;
      coursesSet.add({ instructors, name: `${firstPrefix}-${number}-${letter}` });
    });
  });
  return [...coursesSet];
};
