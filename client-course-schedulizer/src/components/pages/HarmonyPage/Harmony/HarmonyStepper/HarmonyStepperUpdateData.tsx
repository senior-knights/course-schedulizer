import { HarmonyFieldArrayForm } from "components";
import { AnimateShowAndHide } from "components/reuseables";
import React from "react";
import { useHarmonyFormsStore } from "utilities/hooks";

/** Third step in HarmonyStepper. Allows users to make changes to
 *   rooms, courses, professors, and times a schedule can have.
 */
export const HarmonyStepperUpdateData = () => {
  const { rooms, courses, professors, times } = useHarmonyFormsStore();

  return (
    <>
      <AnimateShowAndHide>Update Data</AnimateShowAndHide>
      <HarmonyFieldArrayForm
        defaultValues={professors}
        emptyValue={{ First: "", Last: "" }}
        fieldsName="professors"
      />
      <HarmonyFieldArrayForm
        defaultValues={courses}
        emptyValue={{ Course: "" }}
        fieldsName="courses"
      />
      <HarmonyFieldArrayForm defaultValues={rooms} emptyValue={{ Room: "" }} fieldsName="rooms" />
      <HarmonyFieldArrayForm
        defaultValues={times}
        emptyValue={{ Time: "" }}
        fieldsName="times"
        textFieldProps={{ type: "time" }}
      />
    </>
  );
};
