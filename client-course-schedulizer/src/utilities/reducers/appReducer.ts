import { voidFn } from "utilities";
import { AppAction, AppState, ColorBy, Term } from "utilities/interfaces";
import { getClasses, getMinAndMaxTimes, getProfs, getRooms } from "utilities/services";

/*
  Provides a function to perform multiple setState updates
  at once that depend on each other.
  Can be initialized with a callback to be performed on
  any completed action.
*/
export const reducer = (actionCallback: (item: AppState) => void = voidFn) => {
  return (state: AppState, action: AppAction): AppState => {
    let newState: AppState;
    switch (action.type) {
      case "setScheduleData": {
        let { schedule } = action.payload;
        schedule = schedule || { courses: [] };
        const times = getMinAndMaxTimes(schedule);
        newState = {
          ...state,
          classes: getClasses(schedule),
          professors: getProfs(schedule),
          rooms: getRooms(schedule),
          schedule,
          slotMaxTime: times.maxTime,
          slotMinTime: times.minTime,
        };
        break;
      }
      case "setSelectedTerm": {
        let { term } = action.payload;
        term = term || Term.Fall;
        newState = { ...state, selectedTerm: term };
        break;
      }
      case "setColorBy": {
        let { colorBy } = action.payload;
        colorBy = colorBy || ColorBy.Level;
        newState = { ...state, colorBy };
        break;
      }
      default:
        return state;
    }
    actionCallback(newState);
    return newState;
  };
};
