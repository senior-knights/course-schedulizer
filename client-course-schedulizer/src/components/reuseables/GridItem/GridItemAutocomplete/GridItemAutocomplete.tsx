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
  const { name: nameFallback, errorMessage } = useInput(label, errors);

  return (
    <Grid container direction="column" item xs>
      <Grid item xs>
        <Controller
          control={control}
          defaultValue={defaultValue}
          name={name ?? nameFallback}
          onChange={([, data]: [unknown, unknown]) => {
            return data;
          }}
          render={({ onChange, ...controllerProps }) => {
            const cPropSet = new Set(controllerProps.value);
            const propsCopy = { ...props };
            // Remove existing elements from the autocomplete options
            // Set difference: https://stackoverflow.com/a/36504668/14478665
            propsCopy.options = [
              ...new Set(
                props.options.filter((x) => {
                  return !cPropSet.has(x);
                }),
              ),
            ];
            return (
              <Autocomplete
                autoSelect
                freeSolo
                onChange={(e, data) => {
                  return onChange(data);
                }}
                renderInput={(params) => {
                  return (
                    <TextField
                      label={label}
                      {...params}
                      error={!!errorMessage}
                      helperText={errorMessage}
                      variant="outlined"
                    />
                  );
                }}
                {...propsCopy}
                {...controllerProps}
              />
            );
          }}
        />
      </Grid>
    </Grid>
  );
};

GridItemAutocomplete.defaultProps = {
  defaultValue: undefined,
  name: undefined,
};
