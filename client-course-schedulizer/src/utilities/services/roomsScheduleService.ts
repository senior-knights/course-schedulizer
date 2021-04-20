import forEach from "lodash/forEach";
import { Schedule } from "utilities";
import { getLocationString } from "./scheduleService";

// Get list of unique rooms.
export const getRooms = (schedule: Schedule): string[] => {
  const roomsSet = new Set<string>();
  forEach(schedule.courses, (course) => {
    forEach(course.sections, (section) => {
      forEach(section.meetings, ({ location }) => {
        roomsSet.add(getLocationString(location));
      });
    });
  });
  return [...roomsSet];
};
