import { FormControlLabel, FormLabel, Grid, Radio, RadioGroup } from "@material-ui/core";
import { camelCase } from "lodash";
import React, { ChangeEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import "./GridItemRadioGroup.scss";

export interface GridItemRadioGroup {
  control: ReturnType<typeof useForm>["control"];
  defaultValue: string;
  disabled?: boolean;
  label: string;
  lowercase?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  options: string[];
  register: ReturnType<typeof useForm>["register"];
}

export const GridItemRadioGroup = ({
  control,
  defaultValue,
  disabled,
  label,
  lowercase,
  onChange,
  options,
  register,
}: GridItemRadioGroup) => {
  return (
    <Grid item xs>
      <FormLabel component="legend">{label}</FormLabel>
      <Controller
        ref={register}
        as={RadioGroup}
        control={control}
        defaultValue={defaultValue}
        name={camelCase(label)}
      >
        {options.map((o) => {
          return (
            <FormControlLabel
              key={o.toLowerCase()}
              control={<Radio onChange={onChange} />}
              disabled={disabled}
              label={o}
              value={lowercase ? o.toLowerCase() : o}
            />
          );
        })}
      </Controller>
    </Grid>
  );
};

GridItemRadioGroup.defaultProps = {
  disabled: false,
  lowercase: false,
  onChange: undefined,
};
