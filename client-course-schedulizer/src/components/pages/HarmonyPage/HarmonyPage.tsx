import { AnimateShowAndHide, HarmonyFieldArrayForm } from "components";
import React from "react";
import { Harmony, HarmonyAddAssignments } from "./Harmony";
import { HarmonySchedule } from "./Harmony/HarmonySchedule";

/**
 * The page contains all of the Harmoniously user-experience.
 *   Allows the user to load professor, courses, rooms, and times from
 *   the uploaded schedule as well as edit them and create assignments (constraints).
 * Harmony will find schedules with no conflicts and allow the user to send it back
 *   to the Schedulizer to make edits.
 */
export const HarmonyPage = () => {
  return (
    <>
      <AnimateShowAndHide>Harmony</AnimateShowAndHide>
      <h1>
        Note: This page is in a <i>pre-alpha</i> state. Output might not be perfect.
      </h1>
      <HarmonyFieldArrayForm defaultValue={{ First: "", Last: "" }} fieldsName="professors" />
      <HarmonyFieldArrayForm defaultValue={{ Course: "" }} fieldsName="courses" />
      <HarmonyFieldArrayForm defaultValue={{ Room: "" }} fieldsName="rooms" />
      <HarmonyFieldArrayForm defaultValue={{ Time: "" }} fieldsName="times" />
      <HarmonyAddAssignments />
      <Harmony />
      <HarmonySchedule />
    </>
  );
};
