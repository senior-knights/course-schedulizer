import { Harmony as HarmonyBase, Result } from "@harmoniously/react";
import React, { useEffect, useState } from "react";
import {
  HarmonyAssignmentsState,
  HarmonyResultState,
  useHarmonyAssignmentsStore,
  useHarmonyResultStore,
} from "utilities";

// TODO: move this to the harmony page and allow users to load in exiting data
// temporary hook used to get data from the imported schedule and generate fake assignments.
// const useInferredAssignments = () => {
//   const {
//     appState: { rooms, professors, classes },
//   } = useContext(AppContext);

//   const inferredAssignments: Assignments = {};
//   classes.forEach((cls) => {
//     inferredAssignments[cls] = {
//       professors,
//       rooms: [...rooms, "a", "b"],
//       times,
//     };
//   });

//   return { inferredAssignments, professors, rooms };
// };

const selector = ({ assignments }: HarmonyAssignmentsState) => {
  return assignments;
};

const resultSelector = ({ setResult }: HarmonyResultState) => {
  return setResult;
};

/** Harmony returns a component to automatically create schedules. */
export const Harmony = () => {
  const assignments = useHarmonyAssignmentsStore(selector);
  const setResult = useHarmonyResultStore(resultSelector);
  const [res, setRes] = useState<Result>();

  // Save state in the store.
  useEffect(() => {
    setResult(res);
  }, [res, setResult]);

  // TODO: convert result to a CSV (or a Schedule object) and upload it to the Schedulizer component.

  return (
    <>
      <HarmonyBase assignments={assignments} setResult={setRes} />
    </>
  );
};
