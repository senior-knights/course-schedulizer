import { AppAction, AppState } from "../interfaces/appInterfaces";
import { getProfs } from "./facultySchedule";

/*
  Provides a function to perform multiple setState updates
  at once that depend on each other.
*/
export const reducer = (state: AppState, action: AppAction) => {
  switch (action.type) {
    case "setScheduleData": {
      const { schedule } = action.payload;
      return { ...state, professors: getProfs(schedule), schedule };
    }
    default:
      return state;
  }
};
