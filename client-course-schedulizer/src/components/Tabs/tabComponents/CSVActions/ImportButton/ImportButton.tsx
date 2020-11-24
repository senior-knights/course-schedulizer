import { Button, ButtonProps } from "@material-ui/core";
import React from "react";
import { ImportInputWrapper } from "../../../../reuseables/ImportInputWrapper/ImportInputWrapper";
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