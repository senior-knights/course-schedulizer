import { createContext, Dispatch, SetStateAction } from "react";
import { AppAction, AppState, initialAppState, voidFn } from "utilities";

export interface AppContext {
  appDispatch: Dispatch<AppAction> | (() => void);
  appState: AppState;
  isCSVLoading: boolean;
  setIsCSVLoading: Dispatch<SetStateAction<AppContext["isCSVLoading"]>> | (() => void);
}

/* Used for containing the global state of the app
  and a dispatcher to perform updates against the
  state of the app.
*/
export const AppContext = createContext<AppContext>({
  appDispatch: voidFn,
  appState: initialAppState,
  isCSVLoading: false,
  setIsCSVLoading: voidFn,
});
