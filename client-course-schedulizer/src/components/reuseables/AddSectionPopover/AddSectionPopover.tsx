import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
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
        <Grid item xs>
          <TextField inputRef={register} label="Prefix" name="prefix" />
        </Grid>
        <Grid item xs>
          <TextField inputRef={register} label="Number" name="number" />
        </Grid>
        <Grid item xs>
          <TextField inputRef={register} label="Section" name="section" />
        </Grid>
        <Grid item xs>
          <TextField inputRef={register} label="Load" name="load" />
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs>
          <TextField inputRef={register} label="Instructor" name="instructor" />
        </Grid>
        <Grid item xs>
          <TextField
            defaultValue="08:00"
            inputRef={register}
            label="Start Time"
            name="startTime"
            type="time"
          />
        </Grid>
        <Grid item xs>
          <TextField inputRef={register} label="Duration" name="duration" />
        </Grid>
        <Grid item xs>
          <TextField inputRef={register} label="Location" name="location" />
        </Grid>
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
        <Grid item xs>
          <TextField inputRef={register} label="Notes" multiline name="notes" rows={4} />
        </Grid>
        <Grid item xs>
          <Button color="primary" type="submit" variant="contained">
            Add Section
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
