import { HarmonyAddAssignments } from "components";
import { AnimateShowAndHide } from "components/reuseables";
import React from "react";

export const HarmonyStepperAssignments = () => {
  return (
    <>
      <AnimateShowAndHide>Add Assignments</AnimateShowAndHide>
      <HarmonyAddAssignments />
    </>
  );
};
