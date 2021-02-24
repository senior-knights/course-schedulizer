import { Schedule, Term } from "./dataInterfaces";

export enum ColorBy {
  Level,
  Room,
  Instructor,
  Prefix,
}

// structure for the global app state
export interface AppState {
  colorBy: ColorBy;
  professors: string[];
  rooms: string[];
  schedule: Schedule;
  selectedTerm: Term;
  slotMaxTime: string;
  slotMinTime: string;
}

// Defaults for the app state when it launches
export const initialAppState = {
  colorBy: 0,
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
    schedule?: Schedule;
    term?: Term;
  };
  type: "setScheduleData" | "setSelectedTerm" | "setColorBy"; // add | to add more actions in the future
}
