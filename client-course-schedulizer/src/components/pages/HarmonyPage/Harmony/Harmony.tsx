import { Harmony as HarmonyBase, Result } from "@harmoniously/react";
import React, { useState } from "react";
import { HarmonyAssignmentsState, useHarmonyAssignmentsStore } from "utilities";

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

/** Harmony returns a component to automatically create schedules and
 *   gives metadata about the schedule.
 */
export const Harmony = () => {
  const assignments = useHarmonyAssignmentsStore(selector);
  const [res, setRes] = useState<Result>();
  // TODO: create a zustand store for the result.
  // TODO: convert result to a CSV (or a Schedule object) and upload it to the Schedulizer component.

  return (
    <>
      <HarmonyBase assignments={assignments} setResult={setRes} />
      <div>{JSON.stringify(res)}</div>
    </>
  );
};
