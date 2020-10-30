import { IconButton, Popover } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { bindPopover, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import React from "react";
import { AddSectionPopover } from "../../reuseables/AddSectionPopover";
import "./AddSectionButton.scss";

export const AddSectionButton = () => {
  const popupState = usePopupState({
    popupId: "addSection",
    variant: "popover",
  });

  return (
    <div>
      <IconButton {...bindTrigger(popupState)}>
        <Add />
      </IconButton>
      <Popover
        {...bindPopover(popupState)}
        anchorOrigin={{
          horizontal: "left",
          vertical: "bottom",
        }}
        PaperProps={{ style: { maxWidth: "50%", minWidth: "500px" } }}
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
      >
        <AddSectionPopover />
      </Popover>
    </div>
  );
};
