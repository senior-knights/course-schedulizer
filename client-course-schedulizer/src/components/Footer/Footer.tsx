import { AppBar, Box, Grid } from "@material-ui/core";
import moment from "moment";
import React from "react";
import "./Footer.scss";

// Ref for sticky footer: https://css-tricks.com/couple-takes-sticky-footer/#there-is-flexbox
export const Footer = () => {
  return (
    <AppBar className="app-footer" elevation={0} position="static">
      <Grid container justify="flex-start">
        <Box p={2}>© Senior Knights {moment().year()}</Box>
      </Grid>
    </AppBar>
  );
};
