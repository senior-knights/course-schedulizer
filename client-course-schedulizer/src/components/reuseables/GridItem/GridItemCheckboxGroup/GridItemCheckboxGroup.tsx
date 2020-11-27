import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
} from "@material-ui/core";
import { SectionInput, useInput } from "components";
import React from "react";
import { UseFormMethods } from "react-hook-form";
import "./GridItemCheckboxGroup.scss";

interface GridItemCheckboxGroup {
  hookForm: UseFormMethods<SectionInput>;
  label: string;
  options: string[];
}

/* Renders a group of check boxes.
Ref: https://stackoverflow.com/questions/62291962/react-hook-forms-material-ui-checkboxes */
export const GridItemCheckboxGroup = ({ label, options, hookForm }: GridItemCheckboxGroup) => {
  const { register, errors } = hookForm;
  const { name, errorMessage } = useInput(label, errors);

  return (
    <Grid item xs>
      <FormControl component="fieldset" error={!!errorMessage}>
        <FormLabel component="legend">{label}</FormLabel>
        <FormGroup>
          <Grid container direction="column" justify="center">
            {options.map((opt, i) => {
              return (
                <Grid key={opt} item>
                  <FormControlLabel
                    control={<Checkbox />}
                    defaultChecked={false}
                    inputRef={register}
                    label={opt}
                    name={`${name}[${i}]`}
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

GridItemCheckboxGroup.defaultProps = {};
