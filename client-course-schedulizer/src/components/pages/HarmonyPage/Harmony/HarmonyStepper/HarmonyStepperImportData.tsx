import { Button } from "@material-ui/core";
import { AnimateShowAndHide } from "components/reuseables";
import React, { useCallback } from "react";
import { HarmonyFormsState, useAppContext, useHarmonyFormsStore } from "utilities";

export const HarmonyStepperImportData = () => {
  // TODO: get times
  const {
    appState: { schedule, rooms, professors, classes },
  } = useAppContext();
  const update = useHarmonyFormsStore(selector);

  const hasScheduleData = schedule.courses.length > 0;

  const onClick = useCallback(() => {
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
        return { Course: c };
      }),
    );
    update(
      "rooms",
      rooms.map((r) => {
        return { Room: r };
      }),
    );
    // update("times", times)
  }, [classes, professors, rooms, update]);

  return (
    <>
      <AnimateShowAndHide>Import Data</AnimateShowAndHide>
      <p>Use inferred data from schedule. and set assignments. Optional</p>
      {hasScheduleData && (
        <p>
          We found schedule data: {rooms.length} room(s), {professors.length} professor(s),{" "}
          {classes.length} class(es), and {undefined} time(s). Would you like to import those?
        </p>
      )}
      <Button onClick={onClick} variant="outlined">
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
