import { AppAction, AppState } from "../interfaces/appInterfaces";
import { getProfs } from "./facultySchedule";
import { getRooms } from "./roomsSchedule";

/*
  Provides a function to perform multiple setState updates
  at once that depend on each other.
*/
export const reducer = (state: AppState, action: AppAction): AppState => {
  const { schedule } = action.payload;
  switch (action.type) {
    case "setScheduleData": {
      return { ...state, professors: getProfs(schedule), rooms: getRooms(schedule), schedule };
    }
    default:
      return state;
  }
};
