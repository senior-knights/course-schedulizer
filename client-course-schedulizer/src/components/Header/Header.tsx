import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import React, { MouseEvent, useState } from "react";
import logo from "../../assets/CalvinUniv-vert-full-color-inverse.png";
import "./Header.scss";

export const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="header">
      <AppBar position="static">
        <Toolbar className="toolbar">
          <IconButton
            aria-label="menu"
            className="menu-button"
            color="inherit"
            edge="start"
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            id="simple-menu"
            keepMounted
            onClose={handleClose}
            open={Boolean(anchorEl)}
          >
            <MenuItem onClick={handleClose}>Import</MenuItem>
            <MenuItem onClick={handleClose}>Export</MenuItem>
          </Menu>
          <Typography variant="h6">Course Schedulizer</Typography>
          <img alt="Calvin Logo" className="calvin-logo" src={logo} />
        </Toolbar>
      </AppBar>
    </div>
  );
};
