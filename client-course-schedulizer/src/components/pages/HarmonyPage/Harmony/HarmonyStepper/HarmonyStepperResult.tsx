import { AnimateShowAndHide, Harmony, HarmonySchedule } from "components";
import React from "react";

export const HarmonyStepperResult = () => {
  return (
    <>
      <AnimateShowAndHide>Results</AnimateShowAndHide>
      <Harmony />
      <HarmonySchedule />
    </>
  );
};
