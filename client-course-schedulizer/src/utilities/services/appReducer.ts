import { flatten, map, maxBy, minBy } from "lodash";
import moment from "moment";
import { AppAction, AppState } from "../interfaces/appInterfaces";
import { Meeting, Section, Term } from "../interfaces/dataInterfaces";
import { getProfs } from "./facultySchedule";

/*
  Provides a function to perform multiple setState updates
  at once that depend on each other.
*/
export const reducer = (state: AppState, action: AppAction) => {
  switch (action.type) {
    case "setScheduleData": {
      let { schedule } = action.payload;
      schedule = schedule || { courses: [] };
      const sections: Section[] = flatten(map(schedule.courses, "sections"));
      const meetings: Meeting[] = flatten(map(sections, "meetings"));
      const startTimes = map(map(meetings, "startTime"), (time) => {
        return moment(time, "h:mma");
      });
      const endTimes = map(meetings, (meeting) => {
        return moment(meeting.startTime, "h:mma").add(meeting.duration, "minutes");
      });
      const slotMinTime = minBy(startTimes)?.format("HH:mm") || "6:00";
      const slotMaxTime = maxBy(endTimes)?.format("HH:mm") || "22:00";
      return { ...state, professors: getProfs(schedule), schedule, slotMaxTime, slotMinTime };
    }
    case "setSelectedTerm": {
      let { term } = action.payload;
      term = term || Term.Fall;
      return { ...state, selectedTerm: term };
    }
    default:
      return state;
  }
};
