import { Button } from "@material-ui/core";
import React, { useCallback } from "react";
import { getCSVStr, loadRemoteCSV, useAppContext } from "utilities/hooks";

/**
 * A button users can click to load a demo schedule
 */
export const ViewDemoButton = () => {
  const appContext = useAppContext();

  const demoUrl =
    "?csv=https://raw.githubusercontent.com/senior-knights/course-schedulizer/production/client-course-schedulizer/csv/math-schedule-full.csv";
  const csvIndex = demoUrl.indexOf(getCSVStr);

  const onClick = useCallback(() => {
    loadRemoteCSV(demoUrl, csvIndex, appContext);
  }, [appContext, csvIndex]);

  return (
    <Button onClick={onClick} variant="contained">
      View Demo
    </Button>
  );
};
