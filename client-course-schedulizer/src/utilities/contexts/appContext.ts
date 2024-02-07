import { createContext, Dispatch, SetStateAction } from "react";
import { AppAction, AppState, voidFn } from "utilities";

export interface AppContext {
  appDispatch: Dispatch<AppAction> | (() => void);
  appState: AppState;
  isCSVLoading: boolean;
  setIsCSVLoading: Dispatch<SetStateAction<AppContext["isCSVLoading"]>> | (() => void);
}

enum SemesterLength {
  Full = "Full",
  HalfFirst = "First",
  HalfSecond = "Second",
  IntensiveA = "A",
  IntensiveB = "B",
  IntensiveC = "C",
  IntensiveD = "D",
}

enum Term {
  Fall = "FA",
  Spring = "SP",
  // eslint-disable-next-line typescript-sort-keys/string-enum
  Interim = "IN", // TODO: Remove?
  Summer = "SU",
}


/* Used for containing the global state of the app
  and a dispatcher to perform updates against the
  state of the app.
*/
// Turned off "eslint/no-redeclare"
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AppContext = createContext<AppContext>({
  appDispatch: voidFn,
  appState: {
    classes: [],
    colorBy: 0,
    constraints: {},
    departments: [],
    fileUrl: "",
    professors: [],
    rooms: [],
    schedule: { courses: [], numDistinctSchedules: 0 },
    schedulizerTab: 0,
    selectedSemesterPart: SemesterLength.Full,
    selectedTerm: Term.Fall,
    slotMaxTime: "22:00",
    slotMinTime: "6:00",
    times: [],
  },
  isCSVLoading: false,
  setIsCSVLoading: voidFn,
});
AppContext.displayName = "AppContext";

