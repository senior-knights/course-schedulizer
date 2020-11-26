import { Grid, StandardTextFieldProps, TextField } from "@material-ui/core";
import { camelCase } from "lodash";
import React from "react";
import { useForm } from "react-hook-form";
import "./GridItemTextField.scss";

interface GridItemTextField {
  label: string;
  register: ReturnType<typeof useForm>["register"];
  textFieldProps?: StandardTextFieldProps;
}

export const GridItemTextField = ({ label, register, textFieldProps }: GridItemTextField) => {
  return (
    <Grid item xs>
      <TextField
        inputRef={register}
        label={label}
        name={camelCase(label)}
        {...textFieldProps}
        variant="outlined"
      />
    </Grid>
  );
};

GridItemTextField.defaultProps = {
  textFieldProps: undefined,
};
