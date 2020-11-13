import { Schedule } from "./dataInterfaces";

// structure for the global app state
export interface AppState {
  professors: string[];
  rooms: string[];
  schedule: Schedule;
}

// Defaults for the app state when it launches
export const initialAppState = {
  professors: [],
  rooms: [],
  schedule: { courses: [] },
};

// structure of actions that can be sent to app dispatch
export interface AppAction {
  payload: {
    schedule: Schedule;
  };
  type: "setScheduleData"; // add | to add more actions in the future
}
