import { Harmony as HarmonyBase } from "@harmoniously/react";
import React from "react";
import { AssignmentsState, useAssignmentsStore } from "utilities";

// TODO: allow this to be edited by users.
// const times = ["mwf800", "mwf900", "mwf1030", "mwf1130", "mwf1230", "mwf130", "mwf230", "mwf330"];

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

const selector = ({ assignments }: AssignmentsState) => {
  return assignments;
};

/** Harmony returns a component to automatically create schedules and
 *   gives metadata about the schedule.
 */
export const Harmony = () => {
  // const { inferredAssignments, professors, rooms } = useInferredAssignments();
  const assignments = useAssignmentsStore(selector);

  return (
    <>
      <HarmonyBase assignments={assignments} />
    </>
  );
};
