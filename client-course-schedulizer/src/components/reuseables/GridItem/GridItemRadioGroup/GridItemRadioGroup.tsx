import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { camelCase } from "lodash";
import React, { ChangeEvent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import "./GridItemRadioGroup.scss";

interface GridItemRadioGroup {
  defaultValue?: string;
  label: string;
  name?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  options: string[];
}

/* Renders a group of radio buttons for a form.
Ref: https://stackoverflow.com/questions/64042394/react-hook-form-and-material-ui-formcontrol */
export const GridItemRadioGroup = ({
  defaultValue,
  label,
  name,
  onChange,
  options,
}: GridItemRadioGroup) => {
  const { control } = useFormContext();

  return (
    <Grid item xs>
      <FormControl component="fieldset">
        <FormLabel component="legend">{label}</FormLabel>
        <Controller
          as={
            <RadioGroup>
              {options.map((opt) => {
                return (
                  <FormControlLabel
                    control={<Radio onChange={onChange} />}
                    key={opt}
                    label={opt}
                    value={opt}
                  />
                );
              })}
            </RadioGroup>
          }
          control={control}
          defaultValue={defaultValue}
          name={name ?? camelCase(label)}
        />
      </FormControl>
    </Grid>
  );
};

GridItemRadioGroup.defaultProps = {
  defaultValue: undefined,
  name: undefined,
  onChange: undefined,
};
