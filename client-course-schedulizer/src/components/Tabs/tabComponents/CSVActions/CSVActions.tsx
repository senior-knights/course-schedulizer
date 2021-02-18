import { IconButton, Menu, MenuItem } from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import { ImportInputWrapper } from "components";
import { bindMenu, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import React from "react";
import { useExportCSV, useExportFullCSV } from "utilities";
import "./CSVActions.scss";

/* Hamburger with options for the CSV */
export const CSVActions = () => {
  const popupState = usePopupState({ popupId: "menu", variant: "popover" });
  const onExportClick = useExportCSV();
  const onFullExportClick = useExportFullCSV();

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
        <ImportInputWrapper>
          <MenuItem button className="MuiButton-textPrimary">
            IMPORT SCHEDULE
          </MenuItem>
        </ImportInputWrapper>
        <MenuItem button className="MuiButton-textSecondary" onClick={onExportClick}>
          EXPORT FINAL CSV
        </MenuItem>
        <MenuItem button className="MuiButton-textSecondary" onClick={onFullExportClick}>
          EXPORT DRAFT CSV
        </MenuItem>
      </Menu>
    </>
  );
};
