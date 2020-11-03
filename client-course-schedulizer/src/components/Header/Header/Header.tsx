import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import { bindMenu, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import React from "react";
import logo from "../../../assets/CalvinUniv-vert-full-color-inverse.png";
import { ImportButton } from "../ImportButton";
import { ExportButton } from "../ExportButton";
import "./Header.scss";

export const Header = () => {
  const popupState = usePopupState({ popupId: "menu", variant: "popover" });

  return (
    <div className="header">
      <AppBar position="static">
        <Toolbar className="toolbar">
          <IconButton color="inherit" edge="start" {...bindTrigger(popupState)}>
            <MenuIcon />
          </IconButton>
          <Menu {...bindMenu(popupState)}>
            <MenuItem>
              <ImportButton />
            </MenuItem>
            <MenuItem>
              <ExportButton />
            </MenuItem>
          </Menu>
          <Typography variant="h6">Course Schedulizer</Typography>
          <img alt="Org Logo" className="org-logo" src={logo} />
        </Toolbar>
      </AppBar>
    </div>
  );
};
