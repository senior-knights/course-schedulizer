import { Button, ButtonProps } from "@material-ui/core";
import React from "react";
import { useExportCSV } from "utilities";

// Deprecated, TODO: Remove code?
export const ExportButton = (btnProps: ButtonProps) => {
  const onExportClick = useExportCSV();

  return (
    <Button color="secondary" component="span" onClick={onExportClick} {...btnProps}>
      EXPORT CSV
    </Button> 
  );
};
