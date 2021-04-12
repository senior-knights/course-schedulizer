import { HarmonyFieldArrayForm } from "components";
import { AnimateShowAndHide } from "components/reuseables";
import React from "react";

export const HarmonyStepperImportData = () => {
  return (
    <>
      <AnimateShowAndHide>Import Data</AnimateShowAndHide>
      <HarmonyFieldArrayForm defaultValue={{ First: "", Last: "" }} fieldsName="professors" />
      <HarmonyFieldArrayForm defaultValue={{ Course: "" }} fieldsName="courses" />
      <HarmonyFieldArrayForm defaultValue={{ Room: "" }} fieldsName="rooms" />
      <HarmonyFieldArrayForm defaultValue={{ Time: "" }} fieldsName="times" />
    </>
  );
};
