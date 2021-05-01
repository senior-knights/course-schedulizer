import create, { GetState, SetState, State } from "zustand";

/**
 * A hook to get access to a global store storing all values related to the
 *   forms on the Harmony page. Replacement for Context Providers and Reducers.
 *
 * ref: https://dev.to/karanpratapsingh/simplify-your-store-a-brief-introduction-to-zustand-250h
 */
export const useHarmonyFormsStore = create<HarmonyFormsState>(
  (set: SetState<HarmonyFormsState>, get: GetState<HarmonyFormsState>) => {
    return {
      courses: [],
      professors: [],
      rooms: [],
      times: [],
      update: (key, data) => {
        set({ [key]: data });
      },
    };
  },
);

/** Adds functions to accessors */
export interface HarmonyFormsState extends HarmonyFormsAccessors {
  update: (key: keyof HarmonyFormsAccessors, data: { [key: string]: string }[]) => void;
}

/** labels to retrieve data */
export interface HarmonyFormsAccessors extends State {
  courses: SingularAccessors["course"][];
  professors: SingularAccessors["professor"][];
  rooms: SingularAccessors["room"][];
  times: SingularAccessors["time"][];
}

/** Helper types */
export interface SingularAccessors {
  course: { Course: string };
  professor: { First: string; Last: string };
  room: { Room: string };
  time: { Time: string };
}
