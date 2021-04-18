import { Assignments, ClassLimits } from "@harmoniously/react";
import { immer } from "utilities";
import create, { State } from "zustand";

/**
 * A hook to get access to a global store containing assignment data for Harmony
 * Persists the value in localStorage
 */
export const useHarmonyAssignmentsStore = create<HarmonyAssignmentsState>(
  immer<HarmonyAssignmentsState>((set) => {
    return {
      assignments: {},
      setClass: (className: string, attributes: ClassLimits) => {
        set((state) => {
          state.assignments[className] = attributes;
        });
      },
    };
  }),
);

export interface HarmonyAssignmentsState extends State {
  assignments: Assignments;
  setClass: (className: string, setAttributes: ClassLimits) => void;
}
