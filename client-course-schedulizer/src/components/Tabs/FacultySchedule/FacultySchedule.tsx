import Grid from "@material-ui/core/Grid";
import React from "react";
import { Calendar } from "../../reuseables/Calendar";
import { ScheduleToolbar } from "../../Toolbar/ScheduleToolbar";

// TODO: remove this
const professors = ["Norman", "Adams", "VanderLinden", "Arnold", "Bailey"];

export const FacultySchedule = () => {
  return (
    <>
      <ScheduleToolbar />
      <Grid alignItems="flex-start" container direction="row" justify="flex-start">
        {professors.map((prof, index) => {
          return (
            <span key={prof} className={index !== 0 ? "hide-axis" : ""} style={{ width: 600 }}>
              <h3>{prof}</h3>
              <Calendar key={prof} />
            </span>
          );
        })}
      </Grid>
    </>
  );
};
