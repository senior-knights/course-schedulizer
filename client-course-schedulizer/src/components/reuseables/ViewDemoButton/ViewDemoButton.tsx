import { Button } from "@material-ui/core";
import React, { useCallback } from "react";
import { getCSVStr, loadRemoteCSV, useAppContext } from "utilities/hooks";

/**
 * A button users can click to load a demo schedule
 */
export const ViewDemoButton = () => {
  const appContext = useAppContext();

  const demoUrl =
    "?csv=https://kvlinden.github.io/data/full_schedule_2021-04-07_submitted.csv";
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
