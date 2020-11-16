import { AppAction, AppState } from "../interfaces/appInterfaces";
import { Term } from "../interfaces/dataInterfaces";
import { getProfs } from "./facultySchedule";
import { getMinAndMaxTimes } from "./schedule";

/*
  Provides a function to perform multiple setState updates
  at once that depend on each other.
*/
export const reducer = (state: AppState, action: AppAction) => {
  switch (action.type) {
    case "setScheduleData": {
      let { schedule } = action.payload;
      schedule = schedule || { courses: [] };
      const times = getMinAndMaxTimes(schedule);
      return {
        ...state,
        professors: getProfs(schedule),
        schedule,
        slotMaxTime: times.maxTime,
        slotMinTime: times.minTime,
      };
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
