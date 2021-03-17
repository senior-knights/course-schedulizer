import { Grid, StandardTextFieldProps } from "@material-ui/core";
import React from "react";
import { FormTextField } from "./FormTextField";
import "./GridItemTextField.scss";

export interface GridItemTextField {
  label: string;
  name?: string;
  textFieldProps?: StandardTextFieldProps;
  value?: string;
}

/* A text field to be used on forms */
export const GridItemTextField = (props: GridItemTextField) => {
  return (
    <Grid container direction="column" item xs>
      <Grid item xs>
        <FormTextField {...props} />
      </Grid>
    </Grid>
  );
};

GridItemTextField.defaultProps = {
  name: undefined,
  textFieldProps: undefined,
  value: "",
};
