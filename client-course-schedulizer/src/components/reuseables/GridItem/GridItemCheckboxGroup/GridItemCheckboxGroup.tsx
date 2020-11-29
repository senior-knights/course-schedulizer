import { Checkbox, FormControlLabel, FormLabel, Grid } from "@material-ui/core";
import { camelCase } from "lodash";
import React from "react";
import { useForm } from "react-hook-form";
import "./GridItemCheckboxGroup.scss";

interface GridItemCheckboxGroup {
  label: string;
  options: string[];
  register: ReturnType<typeof useForm>["register"];
}

export const GridItemCheckboxGroup = ({ label, options, register }: GridItemCheckboxGroup) => {
  return (
    <Grid item xs>
      <FormLabel component="legend">{label}</FormLabel>
      <Grid container direction="column">
        {options.map((o, i) => {
          return (
            <Grid key={o.toLowerCase()} item>
              <FormControlLabel
                control={<Checkbox />}
                defaultChecked={false}
                inputRef={register}
                label={o}
                name={`${camelCase(label)}[${i}]`}
                value={o}
              />
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};

GridItemCheckboxGroup.defaultProps = {};
