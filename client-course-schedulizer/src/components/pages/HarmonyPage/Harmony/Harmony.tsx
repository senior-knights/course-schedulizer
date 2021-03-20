import { Harmony as HarmonyBase } from "@harmoniously/react";
import React from "react";
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

  // TODO: create a state to pass to this Component so I cen get the result back
  // Then convert it to a CSV and upload it to the Schedulizer component.

  return (
    <>
      <HarmonyBase assignments={assignments} />
    </>
  );
};
