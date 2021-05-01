import create, { State } from "zustand";

export interface HarmonyStepperCallbackState extends State {
  callbacks: (() => void)[];
  clearCallbacks: () => void;
  pushCallbacks: (callback: () => void) => void;
}

/**
 * Used to get a handle on different callbacks that need to be run
 * when the Harmony stepper transitions to the next page.
 */
export const useHarmonyStepperCallback = create<HarmonyStepperCallbackState>((set) => {
  return {
    callbacks: [],
    clearCallbacks: () => {
      set({ callbacks: [] });
    },
    pushCallbacks: (callback) => {
      set((state) => {
        return { callbacks: [...state.callbacks, callback] };
      });
    },
  };
});
