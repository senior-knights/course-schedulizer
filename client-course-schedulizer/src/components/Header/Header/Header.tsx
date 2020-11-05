import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import { bindMenu, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import React, { useContext } from "react";
import logo from "../../../assets/CalvinUniv-vert-full-color-inverse.png";
import { ImportButton } from "../ImportButton";
import * as writeCSV from "../../../utilities/helpers/writeCSV";
import { ScheduleContext } from "../../../utilities/services/context";
import "./Header.scss";

export const Header = () => {
  const popupState = usePopupState({ popupId: "menu", variant: "popover" });
  const { schedule } = useContext(ScheduleContext);

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
            <MenuItem
              onClick={() => {
                // TODO: make an ExportButton component
                popupState.close();
                // eslint-disable-next-line no-console
                console.log(writeCSV.scheduleToCSVString(schedule));
              }}
            >
              Export CSV
            </MenuItem>
          </Menu>
          <Typography variant="h6">Course Schedulizer</Typography>
          <img alt="Org Logo" className="org-logo" src={logo} />
        </Toolbar>
      </AppBar>
    </div>
  );
};
