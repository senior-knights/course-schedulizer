import { loadLocal } from "utilities/hooks/useLocal";
import { Schedule, Term } from "./dataInterfaces";

export enum ColorBy {
  Level,
  Room,
  Instructor,
  Prefix,
}

export enum SchedulizerTab {
  Faculty = 0,
  Room,
  Loads,
  Conflicts,
}

// structure for the global app state
export interface AppState {
  classes: string[];
  colorBy: ColorBy;
  fileUrl: string;
  professors: string[];
  rooms: string[];
  schedule: Schedule;
  schedulizerTab: SchedulizerTab;
  selectedTerm: Term;
  slotMaxTime: string;
  slotMinTime: string;
}

// Defaults for the app state when it launches, will try to load
//  previous appState (with cleared fileUrl) to launch app from.
//  If no previous state saved, will default to the object below.
export const initialAppState: AppState = loadLocal("appState") || {
  classes: [],
  colorBy: 0,
  fileUrl: "",
  professors: [],
  rooms: [],
  schedule: { courses: [] },
  schedulizerTab: 0,
  selectedTerm: Term.Fall,
  slotMaxTime: "22:00",
  slotMinTime: "6:00",
};

// structure of actions that can be sent to app dispatch
export interface AppAction {
  payload: Partial<AppState>;
  type: "setScheduleData" | "setSelectedTerm" | "setFileUrl" | "setColorBy" | "setSchedulizerTab"; // add | to add more actions in the future
}
