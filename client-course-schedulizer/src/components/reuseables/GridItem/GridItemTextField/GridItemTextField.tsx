import { Grid, StandardTextFieldProps, TextField } from "@material-ui/core";
import { SectionInput, useInput } from "components";
import React from "react";
import { UseFormMethods } from "react-hook-form";
import "./GridItemTextField.scss";

interface GridItemTextField {
  hookForm: UseFormMethods<SectionInput>;
  label: string;
  textFieldProps?: StandardTextFieldProps;
}

/* A text field to be used on forms */
export const GridItemTextField = ({ label, hookForm, textFieldProps }: GridItemTextField) => {
  const { register, errors } = hookForm;
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
