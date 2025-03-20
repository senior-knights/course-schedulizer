import { Button, ButtonProps } from "@material-ui/core";
import React from "react";
import { useExportExcel } from "utilities/hooks/useExportExcel";

export const ExportExcelButton = (btnProps: ButtonProps) => {
  const onExportExcelClick = useExportExcel();

  return (
    <Button color="secondary" component="span" onClick={onExportExcelClick} {...btnProps}>
      EXPORT EXCEL
    </Button>
  );
};
