import { IconButton, Menu, MenuItem } from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import { ImportInputWrapper } from "components";
import { bindMenu, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import React from "react";
import { useExportFullCSV } from "utilities";
import "./CSVActions.scss";

/* Hamburger with options for the CSV */
export const CSVActions = () => {
  const popupState = usePopupState({ popupId: "menu", variant: "popover" });
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
        <ImportInputWrapper isAdditiveImport={false}>
          <MenuItem button>IMPORT NEW SCHEDULE</MenuItem>
        </ImportInputWrapper>
        <ImportInputWrapper isAdditiveImport>
          <MenuItem button>ADD SCHEDULE</MenuItem>
        </ImportInputWrapper>
        <ImportInputWrapper isAdditiveImport>
          <MenuItem button>IMPORT CONSTRAINTS</MenuItem>
        </ImportInputWrapper>
        <MenuItem button onClick={onFullExportClick}>
          EXPORT CSV
        </MenuItem>
      </Menu>
    </>
  );
};
