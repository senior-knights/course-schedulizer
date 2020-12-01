import { Button, ButtonProps } from "@material-ui/core";
import { ImportInputWrapper } from "components";
import React from "react";
import "./ImportButton.scss";

/* An import button that is stylable using the Mat UI props. */
export const ImportButton = (btnProps: ButtonProps) => {
  return (
    <ImportInputWrapper>
      <Button color="primary" component="span" {...btnProps}>
        Import CSV
      </Button>
    </ImportInputWrapper>
  );
};
