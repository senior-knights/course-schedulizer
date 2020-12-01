import { Checkbox, FormControlLabel, FormLabel, Grid } from "@material-ui/core";
import { camelCase } from "lodash";
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
      <Grid container direction="column">
        {options.map((o, i) => {
          return (
            <Grid key={o.toLowerCase()} item>
              <FormControlLabel
                key={o.toLowerCase()}
                control={<Checkbox defaultChecked={value?.includes(o)} />}
                inputRef={register}
                label={o}
                name={`${name || camelCase(label)}[${i}]`}
                value={o}
              />
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};

GridItemCheckboxGroup.defaultProps = {
  name: undefined,
  value: [],
};
