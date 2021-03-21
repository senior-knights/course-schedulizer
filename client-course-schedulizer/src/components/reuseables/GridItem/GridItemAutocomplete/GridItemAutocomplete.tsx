import { Grid, TextField } from "@material-ui/core";
import { Autocomplete, AutocompleteProps } from "@material-ui/lab";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useInput } from "utilities";
import "./GridItemAutocomplete.scss";

interface GridItemAutocomplete {
  defaultValue?: string[];
  label: string;
  name?: string;
}

/* A text field to be used on forms */
export const GridItemAutocomplete = (
  props: GridItemAutocomplete &
    Omit<AutocompleteProps<unknown, boolean, boolean, boolean>, "renderInput">,
) => {
  const { defaultValue, label, name } = props;
  const { control, errors } = useFormContext();
  const { name: nameFallback } = useInput(label, errors);

  return (
    <Grid container direction="column" item xs>
      <Grid item xs>
        <Controller
          as={
            <Autocomplete
              {...props}
              renderInput={(params) => {
                return <TextField label={label} {...params} variant="outlined" />;
              }}
            />
          }
          control={control}
          defaultValue={defaultValue}
          name={name ?? nameFallback}
        />
      </Grid>
    </Grid>
  );
};

GridItemAutocomplete.defaultProps = {
  defaultValue: undefined,
  name: undefined,
};
