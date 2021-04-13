import { HarmonyStepper, Page } from "components";
import React from "react";
import "./HarmonyPage.scss";

/**
 * The page contains all of the Harmoniously user-experience.
 *   Allows the user to load professor, courses, rooms, and times from
 *   the uploaded schedule as well as edit them and create assignments (constraints).
 * Harmony will find schedules with no conflicts and allow the user to send it back
 *   to the Schedulizer to make edits.
 */
export const HarmonyPage = () => {
  return (
    <Page>
      <HarmonyStepper />
    </Page>
  );
};
