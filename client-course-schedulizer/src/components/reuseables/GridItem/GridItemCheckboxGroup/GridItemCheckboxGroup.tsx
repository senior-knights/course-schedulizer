import { Checkbox, FormControlLabel, FormLabel, Grid } from "@material-ui/core";
import React from "react";
import { useForm } from "react-hook-form";
import "./GridItemCheckboxGroup.scss";

export const GridItemCheckboxGroup = ({
  label,
  name,
  options,
  register,
}: {
  label: string;
  name?: string | undefined;
  options: string[];
  register: ReturnType<typeof useForm>["register"];
}) => {
  return (
    <Grid item xs>
      <FormLabel component="legend">{label}</FormLabel>
      {options.map((o, i) => {
        return (
          <FormControlLabel
            key={o.toLowerCase()}
            control={<Checkbox />}
            defaultChecked={false}
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
};
