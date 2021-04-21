import produce, { Draft } from "immer";
import { State, StateCreator } from "zustand";

/**
 * immer is a helper function that is used as a middleware for
 *   zustand stores. This allows one to create the next immutable state
 *   by mutation the first one.
 *
 * Usage:
 *  const useStore = create(immer(set => { ... }));
 *
 * Note: immer isn't limited to zustand use.
 * Ref: https://github.com/pmndrs/zustand#middleware
 */
export const immer = <T extends State>(
  config: StateCreator<T, (fn: (draft: Draft<T>) => void) => void>,
): StateCreator<T> => {
  return (set, get, api) => {
    return config(
      (fn) => {
        return set(produce<T>(fn));
      },
      get,
      api,
    );
  };
};
