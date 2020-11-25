import { Checkbox, FormControlLabel, FormLabel, Grid } from "@material-ui/core";
import React from "react";
import { useForm } from "react-hook-form";
import "./GridItemCheckboxGroup.scss";

interface GridItemCheckboxGroup {
  label: string;
  name?: string;
  options: string[];
  register: ReturnType<typeof useForm>["register"];
  value?: string[];
}

export const GridItemCheckboxGroup = ({
  label,
  name,
  options,
  register,
  value,
}: GridItemCheckboxGroup) => {
  return (
    <Grid item xs>
      <FormLabel component="legend">{label}</FormLabel>
      {options.map((o, i) => {
        return (
          <FormControlLabel
            key={o.toLowerCase()}
            control={<Checkbox defaultChecked={value?.includes(o)} />}
            inputRef={register}
            label={o}
            name={`${name || label.toLowerCase()}[${i}]`}
            value={o}
          />
        );
      })}
    </Grid>
  );
};

GridItemCheckboxGroup.defaultProps = {
  name: undefined,
  value: [],
};
