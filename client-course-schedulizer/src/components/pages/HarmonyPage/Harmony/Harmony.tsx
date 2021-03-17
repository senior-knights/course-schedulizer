import { Assignments, Harmony as H } from "@harmoniously/react";
import React, { useContext } from "react";
import { AppContext } from "utilities/contexts";

// TODO: allow this to be edited by users.
const times = ["mwf800", "mwf900", "mwf1030", "mwf1130", "mwf1230", "mwf130", "mwf230", "mwf330"];

// temporary hook used to get data from the imported schedule and generate fake assignments.
const useInferredAssignments = () => {
  const {
    appState: { rooms, professors, classes },
  } = useContext(AppContext);

  const inferredAssignments: Assignments = {};
  classes.forEach((cls) => {
    inferredAssignments[cls] = {
      professors,
      rooms: [...rooms, "a", "b"],
      times,
    };
  });

  return { inferredAssignments, professors, rooms };
};

/** Harmony returns a component to automatically create schedules and
 *   gives metadata about the schedule.
 */
export const Harmony = () => {
  const { inferredAssignments, professors, rooms } = useInferredAssignments();

  return (
    <>
      <H assignments={inferredAssignments} />
      <div>Professors: {professors}</div>
      <div>Rooms: {rooms}</div>
      <div>Times: {times}</div>
    </>
  );
};
