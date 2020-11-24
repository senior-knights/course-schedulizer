import React from "react";
import { ImportButton } from "../CSVActions/ImportButton";
import { AddSectionButton } from "../../../reuseables/AddSectionButton";
import "./NoCoursesHeader.scss";

/* Display information when schedule has no courses. */
export const NoCoursesHeader = () => {
  return (
    <>
      <h2>No schedule data.</h2>
      <p>
        Please import a CSV of an existing schedule or start building the schedule from scratch by
        adding your first section.
      </p>
      {/* TODO: Fix this. This importButton styling is very weird, and it padding is odd. */}
      <ImportButton className="import-button MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary" />
      <AddSectionButton isIcon={false} />
    </>
  );
};
