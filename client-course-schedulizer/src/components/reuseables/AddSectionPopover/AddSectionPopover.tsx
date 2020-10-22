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
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import React from "react";
import "./AddSectionPopover.scss";

const styles: { row: CSSProperties } = {
  row: {
    flexDirection: "row",
  },
};

export const AddSectionPopover = () => {
  const days = ["M", "T", "W", "R", "F"];
  const terms = ["Fall", "Interim", "Spring", "May"];

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
          <FormControl style={styles.row}>
            <FormLabel component="legend">Days</FormLabel>
            {days.map((day) => {
              return (
                <FormControlLabel key={day.toLowerCase()} control={<Checkbox />} label={day} />
              );
            })}
          </FormControl>
        </Grid>
        <Grid item xs>
          <FormControl>
            <FormLabel component="legend">Term</FormLabel>
            <RadioGroup style={styles.row}>
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
