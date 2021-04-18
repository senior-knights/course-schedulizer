import forEach from "lodash/forEach";
import moment from "moment";
import { Schedule } from "utilities";

// Get list of unique start times.
export const getTimes = (schedule: Schedule): string[] => {
  const timesSet = new Set<string>();
  forEach(schedule.courses, (course) => {
    forEach(course.sections, (section) => {
      forEach(section.meetings, ({ startTime }) => {
        const time24 = moment(startTime, ["h:mm A"]).format("HH:mm");
        timesSet.add(time24);
      });
    });
  });
  return [...timesSet];
};
