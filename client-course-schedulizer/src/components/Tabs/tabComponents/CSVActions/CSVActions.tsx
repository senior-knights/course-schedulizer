import React from "react";
import { Menu as MenuIcon } from "@material-ui/icons";
import { bindMenu, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import { ImportButton } from "./ImportButton";
import { ExportButton } from "./ExportButton";
import "./CSVActions.scss";

/* Hamburger with options for the CSV */
export const CSVActions = () => {
  const popupState = usePopupState({ popupId: "menu", variant: "popover" });

  return (
    <>
      <IconButton color="inherit" edge="start" {...bindTrigger(popupState)}>
        <MenuIcon />
      </IconButton>
      <Menu // Anchoring from: https://codesandbox.io/s/3rmgv?file=/demo.js:603-812
        anchorOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
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
    </>
  );
};
