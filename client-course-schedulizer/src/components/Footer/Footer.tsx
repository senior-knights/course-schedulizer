import { AppBar, Box, Grid } from "@material-ui/core";
import moment from "moment";
import React from "react";
import "./Footer.scss";

/* Provides a footer that is always at the bottom of the page: no matter what.
    Always provides the proper year. To get this working correctly, CSS-Tricks
    was referenced for the flex-box version.
  Ref: https://css-tricks.com/couple-takes-sticky-footer/#there-is-flexbox
*/
export const Footer = () => {
  return (
    <AppBar className="app-footer" elevation={0} position="static">
      <Grid container justify="flex-start">
        <Box p={2}>© {moment().year()} Senior Knights</Box>
      </Grid>
    </AppBar>
  );
};
