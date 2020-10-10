import { AppBar, Button, IconButton, Toolbar, Typography } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import React from "react";

export const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton aria-label="menu" color="inherit" edge="start">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">Course Schedulizer</Typography>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );
};
