import { Grid, StandardTextFieldProps, TextField } from "@material-ui/core";
import React from "react";
import { useForm } from "react-hook-form";
import "./GridItemTextField.scss";

interface GridItemTextField {
  label: string;
  register: ReturnType<typeof useForm>["register"];
  textFieldProps?: StandardTextFieldProps;
  value?: string;
}

export const GridItemTextField = ({
  label,
  register,
  textFieldProps,
  value,
}: GridItemTextField) => {
  return (
    <Grid item xs>
      <TextField
        defaultValue={value}
        inputRef={register}
        label={label}
        name={label.toLowerCase()}
        {...textFieldProps}
      />
    </Grid>
  );
};

GridItemTextField.defaultProps = {
  textFieldProps: undefined,
  value: "",
};
