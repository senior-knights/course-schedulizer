import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import { ExitToApp, Menu } from "@material-ui/icons";
import React from "react";
import "./Header.scss";

export const Header = () => {
  return (
    <div className="header">
      <AppBar position="static">
        <Toolbar className="toolbar">
          <IconButton aria-label="menu" className="menu-button" color="inherit" edge="start">
            <Menu />
          </IconButton>
          <div className="title">
            <Typography variant="h6">Course Schedulizer</Typography>
            <img
              alt="Calvin Logo"
              className="calvin-logo"
              src="https://calvin.edu/dotAsset/0d95e9c5-c5ef-4870-8caf-c0afbfa40dcd.jpg"
            />
          </div>
          <IconButton color="inherit">
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};
