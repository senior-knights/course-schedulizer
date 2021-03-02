import { loadLocal } from "utilities/hooks/useLocal";
import { Schedule, Term } from "./dataInterfaces";

// structure for the global app state
export interface AppState {
  classes: string[];
  fileUrl: string;
  professors: string[];
  rooms: string[];
  schedule: Schedule;
  selectedTerm: Term;
  slotMaxTime: string;
  slotMinTime: string;
}

// Defaults for the app state when it launches, will try to load
//  previous appState (with cleared fileUrl) to launch app from.
//  If no previous state saved, will default to the object below.
export const initialAppState: AppState = loadLocal("appState") || {
  classes: [],
  fileUrl: "",
  professors: [],
  rooms: [],
  schedule: { courses: [] },
  selectedTerm: Term.Fall,
  slotMaxTime: "22:00",
  slotMinTime: "6:00",
};

// structure of actions that can be sent to app dispatch
export interface AppAction {
  payload: {
    fileUrl?: string;
    schedule?: Schedule;
    term?: Term;
  };
  type: "setScheduleData" | "setSelectedTerm" | "setFileUrl"; // add | to add more actions in the future
}
