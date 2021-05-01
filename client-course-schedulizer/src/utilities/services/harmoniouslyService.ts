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
  const stringSet = new Set<string>();
  schedule.courses.forEach((course) => {
    const {
      number,
      prefixes: [firstPrefix],
      sections,
    } = course;
    sections.forEach((section) => {
      const { letter, instructors, isNonTeaching } = section;
      const name = `${firstPrefix}-${number}-${letter}`;
      // Note: Equality between objects returns false.
      const obj = { instructors, name };
      // This is to make sure there are no duplicate classes or teaching loads.
      // TODO: update to work for multiple semester.
      if (!stringSet.has(name) && !isNonTeaching) {
        stringSet.add(name);
        coursesSet.add(obj);
      }
    });
  });
  return [...coursesSet];
};
