import { Box } from "@material-ui/core";
import { AddSectionButton, ImportButton, ViewDemoButton } from "components";
import React from "react";
import "./NoCoursesHeader.scss";

/* Display information when schedule has no courses. */
export const NoCoursesHeader = () => {
  return (
    <>
      <h2>The Schedulizer has been re-engineered.</h2>
        <p>We recommend that you use the new Schedulizer, found here:&nbsp;
          <a href="https://course-schedulizer.netlify.app" target="_blank">https://course-schedulizer.netlify.app</a></p>
      <p>Many thanks to the generations of CS project students to conceived of, designed, built, and maintained the old version.
        <br></br>If you need the old Schedulizer for any reason, use the development version, found here:&nbsp;
          <code>https://sharp-babbage-a45ee2.netlify.app</code>
      </p>
      {/* <ViewDemoButton /> */}
    </>
  );
};
