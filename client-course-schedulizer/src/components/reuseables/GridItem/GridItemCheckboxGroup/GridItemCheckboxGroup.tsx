import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
} from "@material-ui/core";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useInput } from "utilities";
import "./GridItemCheckboxGroup.scss";

interface GridItemCheckboxGroup {
  label: string;
  name?: string;
  options: string[];
  value?: string[];
}

export const GridItemCheckboxGroup = ({ label, name, options, value }: GridItemCheckboxGroup) => {
  const { register, errors } = useFormContext();
  const { name: nameFallback, errorMessage } = useInput(label, errors);

  return (
    <Grid item xs>
      <FormControl component="fieldset" error={!!errorMessage}>
        <FormLabel component="legend">{label}</FormLabel>
        <FormGroup>
          <Grid container direction="column">
            {options.map((opt, i) => {
              return (
                <Grid key={opt} item>
                  <FormControlLabel
                    control={<Checkbox defaultChecked={value?.includes(opt)} />}
                    inputRef={register}
                    label={opt}
                    name={`${name ?? nameFallback}[${i}]`}
                    value={opt}
                  />
                </Grid>
              );
            })}
          </Grid>
        </FormGroup>
        <FormHelperText>{errorMessage}</FormHelperText>
      </FormControl>
    </Grid>
  );
};

GridItemCheckboxGroup.defaultProps = {
  name: undefined,
  value: [],
};
