import { loadInitialState } from "utilities/hooks/useInitialState";
import { Schedule, Term } from "./dataInterfaces";

export enum ColorBy {
  Level,
  Room,
  Instructor,
  Prefix,
}

// structure for the global app state
export interface AppState {
  classes: string[];
  colorBy: ColorBy;
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
export const initialAppState: AppState = loadInitialState() || {
  classes: [],
  colorBy: 0,
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
    colorBy?: ColorBy;
    fileUrl?: string;
    schedule?: Schedule;
    term?: Term;
  };
  type: "setScheduleData" | "setSelectedTerm" | "setFileUrl" | "setColorBy"; // add | to add more actions in the future
}
