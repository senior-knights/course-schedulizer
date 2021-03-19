import { Assignments, ClassLimits } from "@harmoniously/react";
import { immer } from "utilities";
import create, { State } from "zustand";
import { persist } from "zustand/middleware";

/**
 * A hook to get access to a global store containing assignment data for Harmony
 * Persists the value in localStorage
 */
export const useAssignmentsStore = create<AssignmentsState>(
  persist(
    immer<AssignmentsState>((set) => {
      return {
        assignments: {},
        setClass: (className: string, attributes: ClassLimits) => {
          return set((state) => {
            state.assignments[className] = attributes;
          });
        },
      };
    }),
    {
      name: "assignmentsState",
    },
  ),
);

export interface AssignmentsState extends State {
  assignments: Assignments;
  setClass: (className: string, setAttributes: ClassLimits) => void;
}
