import { Button, ButtonProps } from "@material-ui/core";
import React from "react";
import { useExportCSV } from "utilities";

/* A button that will export the current schedule as a CSV with the format specified by the registrar.
  Can style with Mat UI props.
*/
export const ExportButton = (btnProps: ButtonProps) => {
  const onExportClick = useExportCSV();

  return (
    <Button color="secondary" component="span" onClick={onExportClick} {...btnProps}>
      Export CSV
    </Button>
  );
};
