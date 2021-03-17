import { HarmonyFieldArrayForm } from "components";
import React from "react";
import { HarmonyState, useHarmonyStore } from "utilities/hooks/useHarmonyStore";
import { Harmony } from "./Harmony";

// pick values from harmony store.
const selector = ({ professors, courses, times, rooms }: HarmonyState) => {
  return [professors, courses, times, rooms];
};

/**
 * The page contains all of the Harmoniously user-experience.
 *   Allows the user to load professor, courses, rooms, and times from
 *   the uploaded schedule as well as edit them and create assignments (constraints).
 * Harmony will find schedules with no conflicts and allow the user to send it back
 *   to the Schedulizer to make edits.
 */
export const HarmonyPage = () => {
  const [professors, courses, times, rooms] = useHarmonyStore(selector);

  return (
    <>
      <h2>
        Note: This page is in a <i>pre-alpha</i> state. Output might not be perfect.
      </h2>
      <HarmonyFieldArrayForm defaultValue={{ First: "", Last: "" }} fieldsName="professors" />
      <HarmonyFieldArrayForm defaultValue={{ Course: "" }} fieldsName="courses" />
      <HarmonyFieldArrayForm defaultValue={{ Room: "" }} fieldsName="rooms" />
      <HarmonyFieldArrayForm defaultValue={{ Time: "" }} fieldsName="times" />
      {/* For testing */}
      <>{JSON.stringify(professors)}</>
      <>{JSON.stringify(courses)}</>
      <>{JSON.stringify(times)}</>
      <>{JSON.stringify(rooms)}</>
      <Harmony />
    </>
  );
};
