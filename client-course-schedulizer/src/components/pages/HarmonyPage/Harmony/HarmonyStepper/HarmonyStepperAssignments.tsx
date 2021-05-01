import { HarmonyAddAssignments } from "components";
import { AnimateShowAndHide } from "components/reuseables";
import React from "react";

/** Fourth step in HarmonyStepper. Allows users to tweak the
 *   constraints for a valid schedule.
 */
export const HarmonyStepperAssignments = () => {
  return (
    <>
      <AnimateShowAndHide>Assignments</AnimateShowAndHide>
      <HarmonyAddAssignments />
    </>
  );
};
