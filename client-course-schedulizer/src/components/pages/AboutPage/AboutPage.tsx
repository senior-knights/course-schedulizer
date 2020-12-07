import { Box, Grid } from "@material-ui/core";
import { AnimateShowAndHide, Spring3DCard } from "components/reuseables/animated";
import React from "react";
import "./AboutPage.scss";

export const AboutPage = () => {
  return (
    <Box p={5}>
      <AnimateShowAndHide>
        <span>Vision</span>
      </AnimateShowAndHide>
      <p>
        Every year, all department chairs at Calvin must develop a schedule for their department’s
        classes based on a spreadsheet provided to them by the Registrar. The schedule must contain
        the times, professors, and rooms for every class section in the department and the schedule
        must satisfy the following constraints: Only one section can be in a room at a time A
        professor can only teach one section at a time Two sections taken together cannot be offered
        at the same time (e.g. CS 212 is often taken together with MATH 251 and ENGR 220) Professors
        can only teach courses when they are available Professors can only teach courses they are
        qualified to teach Professors must/cannot teach consecutive classes depending on their
        preferences A room’s capacity cannot be exceeded by the expected enrollment in the class
        Faculty teaching loads cannot be “too high” or “too low” These constraints make it extremely
        difficult for the department chair to create a schedule without a tool to help them.
      </p>
      <AnimateShowAndHide>
        <span>Team</span>
      </AnimateShowAndHide>
      <Grid alignItems="flex-start" container direction="column" justify="flex-start">
        <Spring3DCard photo="https://avatars3.githubusercontent.com/u/49655167?s=460&u=b81f525db7da58b19bc28588282b366cd8b748ab&v=4" />
        <Spring3DCard photo="https://avatars1.githubusercontent.com/u/51130302?s=460&u=83737db9aeff2b377654a3e0a7cd3dc39f54f7ff&v=4" />
        <Spring3DCard />
        <Spring3DCard photo="https://avatars0.githubusercontent.com/u/4930536?s=460&u=216f27d175496fec82a87e0c1c1c1514f73997da&v=4" />
        <Spring3DCard photo="https://www.statistics.com/wp-content/uploads/2019/05/dr-randall-pruim.jpg" />
      </Grid>

      <AnimateShowAndHide>
        <span>Code</span>
      </AnimateShowAndHide>
      <AnimateShowAndHide>
        <span>Report</span>
      </AnimateShowAndHide>
    </Box>
  );
};
