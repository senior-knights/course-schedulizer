import { Assignments } from "@harmoniously/react";
import { Button } from "@material-ui/core";
import { AnimateShowAndHide } from "components/reuseables";
import React, { useCallback } from "react";
import {
  HarmonyAssignmentsState,
  HarmonyFormsState,
  useAppContext,
  useHarmonyAssignmentsStore,
  useHarmonyFormsStore,
} from "utilities";

/** Second step in Harmony Stepper. Allows users to import data
 *   and assignments from the current schedule.
 */
export const HarmonyStepperImportData = () => {
  const {
    appState: { schedule, rooms, professors, classes, times },
  } = useAppContext();
  const update = useHarmonyFormsStore(selector);
  const setAssignments = useHarmonyAssignmentsStore(assignmentsSelector);

  const hasScheduleData = schedule.courses.length > 0;

  const addSchedulizerDataToStore = useCallback(() => {
    update(
      "professors",
      professors.map((prof) => {
        const [first, ...rest] = prof.split(" ");
        return { First: first, Last: rest.join(" ") };
      }),
    );
    update(
      "courses",
      classes.map((c) => {
        return { Course: c.name };
      }),
    );
    update(
      "rooms",
      rooms.map((r) => {
        return { Room: r };
      }),
    );
    update(
      "times",
      times.map((time) => {
        return { Time: time };
      }),
    );
    // generated assignments based on current data, professor can only teach certain classes. Any times allowed.

    // foreach class, find the professor that teaches it. then add to the assignments
    const inferredAssignments: Assignments = {};
    classes.forEach((cls) => {
      // get professors who teach the class currently
      const { name, instructors } = cls;

      inferredAssignments[name] = {
        professors: instructors,
        rooms,
        times,
      };
    });
    setAssignments(inferredAssignments);
  }, [classes, professors, rooms, setAssignments, times, update]);

  return (
    <>
      <AnimateShowAndHide>Import Data</AnimateShowAndHide>
      <p>Use inferred data from schedule. and set assignments. Optional</p>
      {hasScheduleData && (
        <p>
          We found schedule data: {rooms.length} room(s), {professors.length} professor(s),{" "}
          {classes.length} class(es), and {times.length} time(s). Would you like to import those?
        </p>
      )}
      <Button onClick={addSchedulizerDataToStore} variant="outlined">
        Import
      </Button>
      {/* <Button>Download JSON</Button>
      <Button>Upload JSON</Button> */}
    </>
  );
};

const selector = (state: HarmonyFormsState) => {
  return state.update;
};

const assignmentsSelector = (state: HarmonyAssignmentsState) => {
  return state.setAssignments;
};
