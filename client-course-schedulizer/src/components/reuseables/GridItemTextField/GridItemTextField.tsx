import { Grid, StandardTextFieldProps, TextField } from "@material-ui/core";
import React from "react";
import { useForm } from "react-hook-form";
import "./GridItemTextField.scss";

export const GridItemTextField = ({
  label,
  register,
  textFieldProps,
}: {
  label: string;
  register: ReturnType<typeof useForm>["register"];
  textFieldProps?: StandardTextFieldProps;
}) => {
  return (
    <Grid item xs>
      <TextField inputRef={register} label={label} name={label.toLowerCase()} {...textFieldProps} />
    </Grid>
  );
};

GridItemTextField.defaultProps = {
  textFieldProps: {},
};
