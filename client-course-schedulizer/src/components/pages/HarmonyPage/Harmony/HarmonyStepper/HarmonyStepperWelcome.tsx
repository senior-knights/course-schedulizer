import { AnimateShowAndHide } from "components";
import React from "react";

/** First step in Harmony stepper. Welcome and information */
export const HarmonyStepperWelcome = () => {
  return (
    <>
      <AnimateShowAndHide>Harmony</AnimateShowAndHide>
      <h1>
        Note: This page is in a <i>pre-alpha</i> state. Output might not be perfect.
      </h1>
    </>
  );
};
