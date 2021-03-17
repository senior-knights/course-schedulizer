import create, { GetState, SetState, State } from "zustand";

/**
 * A hook to get access to a global store storing all values related to the
 *   Harmony page. Replacement for Context Providers and Reducers.
 *
 * ref: https://dev.to/karanpratapsingh/simplify-your-store-a-brief-introduction-to-zustand-250h
 */
export const useHarmonyStore = create<HarmonyState>(
  (set: SetState<HarmonyState>, get: GetState<HarmonyState>) => {
    return {
      add: (key: string, data: string[]) => {
        return set(() => {
          return { [key as keyof Accessors]: data };
        });
      },
      courses: [],
      professors: [],
      rooms: [],
      times: [],
    };
  },
);

/** Adds functions to accessors */
export interface HarmonyState extends Accessors {
  add: (key: string, data: string[]) => void;
}

/** labels to retrieve data */
interface Accessors extends State {
  courses: string[];
  professors: string[];
  rooms: string[];
  times: string[];
}
