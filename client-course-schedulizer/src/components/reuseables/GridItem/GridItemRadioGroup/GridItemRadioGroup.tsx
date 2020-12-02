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
  defaultValue: string;
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
  const { register, control } = useFormContext();

  return (
    <Grid item xs>
      <FormControl component="fieldset">
        <FormLabel component="legend">{label}</FormLabel>
        <Controller
          ref={register()}
          as={
            <RadioGroup>
              {options.map((opt) => {
                return (
                  <FormControlLabel
                    key={opt}
                    control={<Radio onChange={onChange} />}
                    label={opt}
                    value={opt}
                  />
                );
              })}
            </RadioGroup>
          }
          control={control}
          defaultValue={defaultValue}
          name={name || camelCase(label)}
        />
      </FormControl>
    </Grid>
  );
};

GridItemRadioGroup.defaultProps = {
  name: undefined,
  onChange: undefined,
};
