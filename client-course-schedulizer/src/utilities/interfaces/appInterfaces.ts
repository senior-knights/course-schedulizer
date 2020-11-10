import { Schedule } from "./dataInterfaces";

// structure for the global app state
export interface AppState {
  isLoading: boolean;
  professors: string[];
  schedule: Schedule;
}

// Defaults for the app state when it launches
export const initialAppState = {
  isLoading: false,
  professors: [],
  schedule: { courses: [] },
};

// structure of actions that can be sent to app dispatch
export interface AppAction {
  payload: {
    schedule: Schedule;
  };
  type: "setScheduleData"; // add | to add more actions in the future
}
