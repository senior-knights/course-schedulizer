import create, { GetState, SetState, State } from "zustand";
import { persist } from "zustand/middleware";

/**
 * A hook to get access to a global store storing all values related to the
 *   forms on the Harmony page. Replacement for Context Providers and Reducers.
 * Persists the value in localStorage
 *
 * ref: https://dev.to/karanpratapsingh/simplify-your-store-a-brief-introduction-to-zustand-250h
 */
export const useHarmonyFormsStore = create<HarmonyFormsState>(
  persist<HarmonyFormsState>(
    (set: SetState<HarmonyFormsState>, get: GetState<HarmonyFormsState>) => {
      return {
        courses: [],
        professors: [],
        rooms: [],
        times: [],
        update: (key: string, data: string[]) => {
          return set(() => {
            return { [key as keyof HarmonyFormsAccessors]: data };
          });
        },
      };
    },
    {
      name: "harmonyState",
    },
  ),
);

/** Adds functions to accessors */
export interface HarmonyFormsState extends HarmonyFormsAccessors {
  update: (key: string, data: string[]) => void;
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
