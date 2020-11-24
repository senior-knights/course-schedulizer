import React from "react";
import { Menu as MenuIcon } from "@material-ui/icons";
import { bindMenu, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import "./CSVActions.scss";
import { ImportInputWrapper } from "../../../reuseables/ImportInputWrapper/ImportInputWrapper";
import { useExportCSV } from "../../../../utilities/hooks/useExportCSV";

/* Hamburger with options for the CSV */
export const CSVActions = () => {
  const popupState = usePopupState({ popupId: "menu", variant: "popover" });
  const onExportClick = useExportCSV();

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
        <MenuItem button className="MuiButton-textPrimary">
          <ImportInputWrapper>IMPORT CSV</ImportInputWrapper>
        </MenuItem>
        <MenuItem button className="MuiButton-textSecondary" onClick={onExportClick}>
          EXPORT CSV
        </MenuItem>
      </Menu>
    </>
  );
};
