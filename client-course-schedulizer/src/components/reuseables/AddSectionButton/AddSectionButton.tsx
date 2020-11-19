import { Button, ButtonProps, IconButton, Popover } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { bindPopover, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import React from "react";
import { AddSectionPopover } from "../AddSectionPopover";
import "./AddSectionButton.scss";

interface AddSectionButton extends ButtonProps {
  isIcon?: boolean;
}

export const AddSectionButton = (props: AddSectionButton) => {
  const popupState = usePopupState({
    popupId: "addSection",
    variant: "popover",
  });
  const { isIcon, ...buttonProps } = props;

  return (
    <>
      {isIcon ? (
        <IconButton {...bindTrigger(popupState)}>
          <Add />
        </IconButton>
      ) : (
        <Button color="secondary" variant="contained" {...buttonProps} {...bindTrigger(popupState)}>
          Add Section
        </Button>
      )}
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
    </>
  );
};

AddSectionButton.defaultProps = {
  isIcon: true,
};
