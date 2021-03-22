import { Result } from "@harmoniously/react";
import create, { GetState, SetState, State } from "zustand";
import { persist } from "zustand/middleware";

export const useHarmonyResultStore = create<HarmonyResultState>(
  persist<HarmonyResultState>(
    (set: SetState<HarmonyResultState>, get: GetState<HarmonyResultState>) => {
      return {
        result: {},
        setResult: (res: Result) => {
          set({ result: res });
        },
      };
    },
    {
      name: "harmonyResultState",
    },
  ),
);

export interface HarmonyResultState extends State {
  result: Result;
  setResult: (res: Result) => void;
}
