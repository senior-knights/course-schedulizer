import { createContext, Dispatch, SetStateAction } from "react";
import { AppAction, AppState, initialAppState } from "../interfaces/appInterfaces";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const voidFn = () => {};

interface AppContext {
  appDispatch: Dispatch<AppAction> | (() => void);
  appState: AppState;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<AppContext["isLoading"]>> | (() => void);
}

/* Used for containing the global state of the app
  and a dispatcher to perform updates against the
  state of the app.
*/
export const AppContext = createContext<AppContext>({
  appDispatch: voidFn,
  appState: initialAppState,
  isLoading: false,
  setIsLoading: voidFn,
});
