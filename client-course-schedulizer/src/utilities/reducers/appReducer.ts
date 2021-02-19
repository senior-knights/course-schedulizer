import { AppAction, AppState, Term } from "utilities/interfaces";
import { getClasses, getMinAndMaxTimes, getProfs, getRooms } from "utilities/services";

/*
  Provides a function to perform multiple setState updates
  at once that depend on each other.
*/
export const reducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "setScheduleData": {
      let { schedule } = action.payload;
      schedule = schedule || { courses: [] };
      const times = getMinAndMaxTimes(schedule);
      return {
        ...state,
        classes: getClasses(schedule),
        professors: getProfs(schedule),
        rooms: getRooms(schedule),
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
