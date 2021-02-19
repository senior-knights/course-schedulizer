import { saveLocal } from "utilities/hooks";
import { AppAction, AppState, Term } from "utilities/interfaces";
import { getMinAndMaxTimes, getProfs, getRooms } from "utilities/services";

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
      const newState = {
        ...state,
        professors: getProfs(schedule),
        rooms: getRooms(schedule),
        schedule,
        slotMaxTime: times.maxTime,
        slotMinTime: times.minTime,
      };
      saveLocal("appState", newState);
      return newState;
    }
    case "setSelectedTerm": {
      let { term } = action.payload;
      term = term || Term.Fall;
      // TODO: use a thunk? to run saveLocal always after? See old commits
      const newState = { ...state, selectedTerm: term };
      saveLocal("appState", newState);
      return newState;
    }
    default:
      return state;
  }
};
