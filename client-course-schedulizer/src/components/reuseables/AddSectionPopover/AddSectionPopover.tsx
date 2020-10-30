import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { GridItemTextField } from "../GridItemTextField";
import "./AddSectionPopover.scss";

export const AddSectionPopover = () => {
  const days = ["M", "T", "W", "R", "F"];
  const terms = ["Fall", "Spring", "Summer"];

  const schema = Yup.object().shape({
    days: Yup.array().transform((d) => {
      return d.filter((day: boolean | string) => {
        return day;
      });
    }),
  });

  const { register, handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data: unknown) => {
    return console.log(data);
  };

  return (
    <form className="popover-container" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        <GridItemTextField label="Prefix" register={register} />
        <GridItemTextField label="Number" register={register} />
        <GridItemTextField label="Section" register={register} />
        <GridItemTextField label="Load" register={register} />
      </Grid>
      <Grid container spacing={4}>
        <GridItemTextField label="Instructor" register={register} />
        <GridItemTextField
          label="Start Time"
          register={register}
          textFieldProps={{ defaultValue: "08:00", name: "startTime", type: "time" }}
        />
        <GridItemTextField label="Duration" register={register} />
        <GridItemTextField label="Location" register={register} />
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs>
          <FormLabel component="legend">Days</FormLabel>
          {days.map((day, i) => {
            return (
              <FormControlLabel
                key={day.toLowerCase()}
                control={<Checkbox />}
                defaultChecked={false}
                inputRef={register}
                label={day}
                name={`days[${i}]`}
                value={day}
              />
            );
          })}
        </Grid>
        <Grid item xs>
          <FormLabel component="legend">Term</FormLabel>
          <Controller
            ref={register}
            as={RadioGroup}
            control={control}
            defaultValue="fall"
            name="term"
          >
            {terms.map((term) => {
              return (
                <FormControlLabel
                  key={term.toLowerCase()}
                  control={<Radio />}
                  label={term}
                  value={term.toLowerCase()}
                />
              );
            })}
          </Controller>
        </Grid>
        <GridItemTextField
          label="Notes"
          register={register}
          textFieldProps={{ multiline: true, rows: 4 }}
        />
        <Grid item xs>
          <Button color="primary" type="submit" variant="contained">
            Add Section
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
