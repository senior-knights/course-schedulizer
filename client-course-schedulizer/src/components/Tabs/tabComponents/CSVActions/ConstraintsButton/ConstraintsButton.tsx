import { Button, ButtonProps } from "@material-ui/core";
import { ImportInputWrapper } from "components";
import React from "react";
import "../CSVActions.scss";

// Deprecated, TODO: Remove code?
export const ConstraintsButton = (btnProps: ButtonProps) => {
  return (
    <ImportInputWrapper>
      <Button color="secondary" component="span" {...btnProps}>
        ADD CONSTRAINTS
      </Button> 
    </ImportInputWrapper>
  );
};