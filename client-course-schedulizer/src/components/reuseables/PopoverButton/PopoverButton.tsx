import { Button, ButtonProps, IconButton, Popover } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { bindPopover, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import React from "react";
import "./PopoverButton.scss";

interface PopoverButton extends ButtonProps {
  buttonTitle?: string;
  isIcon?: boolean;
  minWidth?: string;
  popupId?: string;
}

export const PopoverButton = (props: PopoverButton) => {
  const { isIcon, popupId, buttonTitle, minWidth, children, ...buttonProps } = props;
  const popupState = usePopupState({
    popupId,
    variant: "popover",
  });

  return (
    <>
      {isIcon ? (
        <IconButton {...bindTrigger(popupState)}>
          <Add />
        </IconButton>
      ) : (
        <Button color="secondary" variant="contained" {...buttonProps} {...bindTrigger(popupState)}>
          {buttonTitle}
        </Button>
      )}
      <Popover
        {...bindPopover(popupState)}
        anchorOrigin={{
          horizontal: "left",
          vertical: "bottom",
        }}
        PaperProps={{ style: { minWidth } }}
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
      >
        {children}
      </Popover>
    </>
  );
};

PopoverButton.defaultProps = {
  buttonTitle: "Add Section",
  isIcon: true,
  minWidth: "500px",
  popupId: "addSection",
};
