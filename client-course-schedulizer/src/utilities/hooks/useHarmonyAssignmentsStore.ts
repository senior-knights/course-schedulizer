import { Assignments, ClassLimits } from "@harmoniously/react";
import { immer } from "utilities";
import create, { State } from "zustand";

/**
 * A hook to get access to a global store containing assignment data for Harmony
 */
export const useHarmonyAssignmentsStore = create<HarmonyAssignmentsState>(
  immer<HarmonyAssignmentsState>((set) => {
    return {
      assignments: {},
      setAssignments: (newAssignments: Assignments) => {
        set((state) => {
          state.assignments = newAssignments;
        });
      },
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
  setAssignments: (newAssignments: Assignments) => void;
  setClass: (className: string, setAttributes: ClassLimits) => void;
}
