import { Grid, StandardTextFieldProps, TextField } from "@material-ui/core";
import { useInput } from "components";
import React from "react";
import { useFormContext } from "react-hook-form";
import "./GridItemTextField.scss";

interface GridItemTextField {
  label: string;
  textFieldProps?: StandardTextFieldProps;
}

/* A text field to be used on forms */
export const GridItemTextField = ({ label, textFieldProps }: GridItemTextField) => {
  const { register, errors } = useFormContext();
  const { name, errorMessage } = useInput(label, errors);

  return (
    <Grid container direction="column" item xs>
      <Grid item xs>
        <TextField
          inputRef={register}
          label={label}
          name={name}
          {...textFieldProps}
          error={!!errorMessage}
          helperText={errorMessage}
          variant="outlined"
        />
      </Grid>
    </Grid>
  );
};

GridItemTextField.defaultProps = {
  textFieldProps: undefined,
};
