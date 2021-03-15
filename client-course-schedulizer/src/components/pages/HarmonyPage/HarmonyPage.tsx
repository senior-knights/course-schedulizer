import { FieldArrayForm } from "components";
import React from "react";
// import { Harmony } from "./Harmony";

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
      <h2>
        Note: This page is in a <i>pre-alpha</i> state. Output might not be perfect.
      </h2>
      <FieldArrayForm defaultValue={{ First: "", Last: "" }} fieldsName="professors" />
      <FieldArrayForm defaultValue={{ Course: "" }} fieldsName="courses" />
      <FieldArrayForm defaultValue={{ Room: "" }} fieldsName="rooms" />
      <FieldArrayForm defaultValue={{ Time: "" }} fieldsName="times" />
      {/* TODO: remove this for now */}
      {/* <Harmony /> */}
    </>
  );
};
