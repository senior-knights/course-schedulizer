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
          <Menu // Anchoring from: https://codesandbox.io/s/3rmgv?file=/demo.js:603-812
            anchorOrigin={{
              horizontal: "right",
              vertical: "top",
            }}
            elevation={0}
            getContentAnchorEl={null}
            transformOrigin={{
              horizontal: "left",
              vertical: "top",
            }}
            {...bindMenu(popupState)}
          >
            <MenuItem className="import-menu-item">
              <ImportButton />
            </MenuItem>
            <MenuItem className="export-menu-item">
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
