import { Grid } from "@material-ui/core";
import { Autocomplete, AutocompleteProps } from "@material-ui/lab";
import { FormTextField } from "components";
import React from "react";
import "./GridItemAutocomplete.scss";

interface GridItemAutocomplete {
  autocompleteProps?: AutocompleteProps<unknown, boolean, boolean, boolean>;
  label: string;
  name?: string;
  options: string[];
  value?: string;
}

/* A text field to be used on forms */
export const GridItemAutocomplete = ({
  autocompleteProps,
  label,
  value,
  name,
  options,
}: GridItemAutocomplete) => {
  return (
    <Grid container direction="column" item xs>
      <Grid item xs>
        <Autocomplete
          {...autocompleteProps}
          options={options}
          renderInput={(params) => {
            return (
              <FormTextField label={label} name={name} textFieldProps={params} value={value} />
            );
          }}
        />
      </Grid>
    </Grid>
  );
};

GridItemAutocomplete.defaultProps = {
  autocompleteProps: undefined,
  name: undefined,
  value: "",
};
