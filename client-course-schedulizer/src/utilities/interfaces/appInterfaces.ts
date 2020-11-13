import { Schedule, Term } from "./dataInterfaces";

// structure for the global app state
export interface AppState {
  professors: string[];
  schedule: Schedule;
  selectedTerm: Term;
}

// Defaults for the app state when it launches
export const initialAppState = {
  professors: [],
  schedule: { courses: [] },
  selectedTerm: Term.Fall,
};

// structure of actions that can be sent to app dispatch
export interface AppAction {
  payload: {
    schedule?: Schedule;
    term?: Term;
  };
  type: "setScheduleData" | "setSelectedTerm"; // add | to add more actions in the future
}
