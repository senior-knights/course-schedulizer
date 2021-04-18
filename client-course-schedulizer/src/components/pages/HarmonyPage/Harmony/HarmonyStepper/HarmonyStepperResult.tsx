import { AnimateShowAndHide, Harmony, HarmonySchedule } from "components";
import React from "react";

/** Fifth step in HarmonyStepper. Shows the results of Harmony
 *   and will display the valid schedule on the calendar.
 */
export const HarmonyStepperResult = () => {
  return (
    <>
      <AnimateShowAndHide>Results</AnimateShowAndHide>
      <Harmony />
      <HarmonySchedule />
    </>
  );
};
