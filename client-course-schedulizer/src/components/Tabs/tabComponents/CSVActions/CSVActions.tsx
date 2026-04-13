import { IconButton, Menu, MenuItem } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { ImportInputWrapper } from "components";
import { bindMenu, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import React from "react";
import { useExportFullCSV } from "utilities";
import { useExportExcel } from "utilities/hooks/useExportExcel";
import "./CSVActions.scss";

/* Hamburger with options for the CSV */
export const CSVActions = () => {
  const popupState = usePopupState({ popupId: "menu", variant: "popover" });
  const onFullExportClick = useExportFullCSV();
  const onExportExcelClick = useExportExcel();

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
        // getContentAnchorEl={null}
        transformOrigin={{
          horizontal: "left",
          vertical: "top",
        }}
        {...bindMenu(popupState)}
      >
        <ImportInputWrapper isAdditiveImport={false}>
          <MenuItem>IMPORT NEW SCHEDULE</MenuItem>
        </ImportInputWrapper>
        <ImportInputWrapper isAdditiveImport>
          <MenuItem>ADD ADDITIONAL SCHEDULE</MenuItem>
        </ImportInputWrapper>
        <ImportInputWrapper isAdditiveImport>
          <MenuItem>IMPORT CONSTRAINTS</MenuItem>
        </ImportInputWrapper>
        <MenuItem onClick={onExportExcelClick}>
          EXPORT EXCEL
        </MenuItem>
      </Menu>
    </>
  );
};
