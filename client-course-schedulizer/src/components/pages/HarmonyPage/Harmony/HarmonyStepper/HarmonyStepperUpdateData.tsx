import { HarmonyFieldArrayForm } from "components";
import { AnimateShowAndHide } from "components/reuseables";
import React from "react";
import { useHarmonyFormsStore } from "utilities/hooks";

export const HarmonyStepperUpdateData = () => {
  const { rooms, courses, professors, times } = useHarmonyFormsStore();

  return (
    <>
      <AnimateShowAndHide>Update Data</AnimateShowAndHide>
      <HarmonyFieldArrayForm
        defaultValue={{ First: "", Last: "" }}
        defaultValues={professors}
        fieldsName="professors"
      />
      <HarmonyFieldArrayForm
        defaultValue={{ Course: "" }}
        defaultValues={courses}
        fieldsName="courses"
      />
      <HarmonyFieldArrayForm defaultValue={{ Room: "" }} defaultValues={rooms} fieldsName="rooms" />
      <HarmonyFieldArrayForm
        defaultValue={{ Time: "" }}
        defaultValues={times}
        fieldsName="times"
        textFieldProps={{ type: "time" }}
      />
    </>
  );
};
