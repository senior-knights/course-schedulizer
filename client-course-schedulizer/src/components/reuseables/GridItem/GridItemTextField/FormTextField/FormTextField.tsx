import { TextField } from "@material-ui/core";
import { GridItemTextField } from "components";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useInput } from "utilities";
import "./FormTextField.scss";

export const FormTextField = ({ label, textFieldProps, value, name }: GridItemTextField) => {
  const { register, errors } = useFormContext();
  const { name: nameFallback, errorMessage } = useInput(label, errors);

  return (
    <TextField
      defaultValue={value}
      fullWidth
      inputRef={register}
      label={label}
      name={name ?? nameFallback}
      {...textFieldProps}
      error={!!errorMessage}
      helperText={errorMessage}
      variant="outlined"
    />
  );
};
