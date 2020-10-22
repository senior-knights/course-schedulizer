import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import React from "react";
import "./AddSectionPopover.scss";

export const AddSectionPopover = () => {
  return (
    <div className="popover-container">
      <Grid container spacing={4}>
        <Grid item xs>
          <TextField label="Prefix" />
        </Grid>
        <Grid item xs>
          <TextField label="Number" />
        </Grid>
        <Grid item xs>
          <TextField label="Section" />
        </Grid>
        <Grid item xs>
          <TextField label="Load" />
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs>
          <TextField label="Instructor" />
        </Grid>
        <Grid item xs>
          <TextField defaultValue="08:00" label="Start Time" type="time" />
        </Grid>
        <Grid item xs>
          <TextField label="Duration" />
        </Grid>
        <Grid item xs>
          <TextField label="Location" />
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs>
          <FormControl>
            <FormLabel component="legend">Days</FormLabel>
            <FormControlLabel control={<Checkbox />} label="M" />
            <FormControlLabel control={<Checkbox />} label="T" />
            <FormControlLabel control={<Checkbox />} label="W" />
            <FormControlLabel control={<Checkbox />} label="R" />
            <FormControlLabel control={<Checkbox />} label="F" />
          </FormControl>
        </Grid>
        <Grid item xs>
          <FormControl>
            <FormLabel component="legend">Term</FormLabel>
            <RadioGroup>
              <FormControlLabel control={<Radio />} label="Fall" value="fall" />
              <FormControlLabel control={<Radio />} label="Winter" value="winter" />
              <FormControlLabel control={<Radio />} label="Spring" value="spring" />
              <FormControlLabel control={<Radio />} label="May" value="may" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs>
          <TextField label="Notes" multiline rows={4} />
        </Grid>
        <Grid item xs>
          <Button color="primary" variant="contained">
            Add Section
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};
