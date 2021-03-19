import create, { GetState, SetState, State } from "zustand";
import { persist } from "zustand/middleware";

/**
 * A hook to get access to a global store storing all values related to the
 *   Harmony page. Replacement for Context Providers and Reducers.
 * Persists the value in localStorage
 *
 * ref: https://dev.to/karanpratapsingh/simplify-your-store-a-brief-introduction-to-zustand-250h
 */
export const useHarmonyStore = create<HarmonyState>(
  persist<HarmonyState>(
    (set: SetState<HarmonyState>, get: GetState<HarmonyState>) => {
      return {
        courses: [],
        professors: [],
        rooms: [],
        times: [],
        update: (key: string, data: string[]) => {
          return set(() => {
            return { [key as keyof HarmonyAccessors]: data };
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
export interface HarmonyState extends HarmonyAccessors {
  update: (key: string, data: string[]) => void;
}

/** labels to retrieve data */
export interface HarmonyAccessors extends State {
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
