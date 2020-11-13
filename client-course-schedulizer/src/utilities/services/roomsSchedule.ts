import forEach from "lodash/forEach";
import { Schedule } from "../interfaces/dataInterfaces";

// Get list of unique rooms.
// TODO: see if I ran reuse logic.
export const getRooms = (schedule: Schedule): string[] => {
  const professorsSet = new Set<string>();
  forEach(schedule.courses, (course) => {
    forEach(course.sections, (section) => {
      forEach(section.meetings, ({ location }) => {
        professorsSet.add(`${location.building} ${location.roomNumber}`);
      });
    });
  });
  return [...professorsSet];
};
