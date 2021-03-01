import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useInput } from "utilities";
import "./GridItemCheckboxGroup.scss";

interface GridItemCheckboxGroup {
  initialValue?: string[];
  label: string;
  name?: string;
  options: string[];
}

export const GridItemCheckboxGroup = ({
  label,
  name,
  options,
  initialValue,
}: GridItemCheckboxGroup) => {
  const { register, errors } = useFormContext();
  const { name: nameFallback, errorMessage } = useInput(label, errors);
  const [value, onValueChange] = useState(initialValue);

  useEffect(() => {
    onValueChange(initialValue);
  }, [initialValue]);

  const onCheckboxChange = (opt: string) => {
    return () => {
      if (value) {
        if (value?.includes(opt)) {
          const valueCopy = [...value];
          valueCopy.splice(valueCopy.indexOf(opt), 1);
          onValueChange(valueCopy);
        } else {
          onValueChange([...value, opt]);
        }
      } else {
        onValueChange([opt]);
      }
    };
  };

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
                    control={
                      <Checkbox checked={value?.includes(opt)} onChange={onCheckboxChange(opt)} />
                    }
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
  initialValue: [],
  name: undefined,
};
