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
import { Controller, useForm } from "react-hook-form";
import "./GridItemRadioGroup.scss";

export interface GridItemRadioGroup {
  control: ReturnType<typeof useForm>["control"];
  defaultValue: string;
  label: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  options: string[];
  register: ReturnType<typeof useForm>["register"];
}

/* Renders a group of radio buttons for a form.
Ref: https://stackoverflow.com/questions/64042394/react-hook-form-and-material-ui-formcontrol */
export const GridItemRadioGroup = ({
  control,
  defaultValue,
  label,
  onChange,
  options,
  register,
}: GridItemRadioGroup) => {
  return (
    <Grid item xs>
      <FormControl component="fieldset">
        <FormLabel component="legend">{label}</FormLabel>
        <Controller
          ref={register}
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
          name={camelCase(label)}
        />
      </FormControl>
    </Grid>
  );
};

GridItemRadioGroup.defaultProps = {
  onChange: undefined,
};
