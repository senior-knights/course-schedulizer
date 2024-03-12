import { Grid, StandardTextFieldProps, TextField } from "@material-ui/core";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useInput } from "utilities";
import "./GridItemTextField.scss";

interface GridItemTextField {
  label: string;
  name?: string;
  textFieldProps?: StandardTextFieldProps;
  value?: string;
}

/* A text field to be used on forms */
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GridItemTextField = ({ label, textFieldProps, value, name }: GridItemTextField) => {
  const { register, errors } = useFormContext();
  const { name: nameFallback, errorMessage } = useInput(label, errors);

  return (
    <Grid container direction="column" item xs>
      <Grid item xs>
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
      </Grid>
    </Grid>
  );
};

GridItemTextField.defaultProps = {
  name: undefined,
  textFieldProps: undefined,
  value: "",
};
