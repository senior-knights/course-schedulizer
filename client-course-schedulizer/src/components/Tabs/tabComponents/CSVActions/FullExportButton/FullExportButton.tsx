import { Button, ButtonProps } from "@material-ui/core";
import React from "react";
import { useExportFullCSV } from "utilities";

/* A button that will export the current schedule as a CSV with all fields.
  Can style with Mat UI props.
*/
export const FullExportButton = (btnProps: ButtonProps) => {
  const onFullExportClick = useExportFullCSV();

  return (
    <Button color="secondary" component="span" onClick={onFullExportClick} {...btnProps}>
      Export Full CSV
    </Button>
  );
};
