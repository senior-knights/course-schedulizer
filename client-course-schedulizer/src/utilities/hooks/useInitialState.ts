import { AppState } from "utilities";
import { loadLocal } from "utilities/hooks/useLocal";

export const loadInitialState = (): AppState | undefined => {
  const savedState = loadLocal<AppState>("appState");
  // Clear fileUrl
  if (savedState !== undefined) {
    // savedState.fileUrl = "";
  }
  return savedState;
};
