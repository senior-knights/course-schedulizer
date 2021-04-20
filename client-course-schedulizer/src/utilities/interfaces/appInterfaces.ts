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
  departments: string[];
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
//  previous appState to launch app from.
//  If no previous state saved, will default to the object below.
export const initialAppState: AppState = loadLocal("appState") || {
  classes: [],
  colorBy: 0,
  departments: [],
  fileUrl: "",
  professors: [],
  rooms: [],
  schedule: { courses: [] },
  schedulizerTab: 0,
  selectedTerm: Term.Fall,
  slotMaxTime: "22:00",
  slotMinTime: "6:00",
};

// Ensure that these aren't undefined if they didn't exist in the previous app state
if (!initialAppState.classes) {
  initialAppState.departments = [];
}
if (!initialAppState.departments) {
  initialAppState.departments = [];
}
if (!initialAppState.professors) {
  initialAppState.departments = [];
}
if (!initialAppState.rooms) {
  initialAppState.departments = [];
}

// structure of actions that can be sent to app dispatch
export interface AppAction {
  payload: Partial<AppState>;
  type: "setScheduleData" | "setSelectedTerm" | "setFileUrl" | "setColorBy" | "setSchedulizerTab"; // add | to add more actions in the future
}
