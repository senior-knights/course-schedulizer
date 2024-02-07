import { ButtonProps } from "@material-ui/core";
import { AddSectionPopover } from "components";
import React from "react";
import { PopoverButton } from "../PopoverButton";
import "./AddSectionButton.scss";

interface AddSectionButton extends ButtonProps {
  isIcon?: boolean;
}

// Turned off "eslint/no-redeclare"
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AddSectionButton = (props: AddSectionButton) => {
  const { isIcon } = props;

  return (
    <PopoverButton isIcon={isIcon}>
      <AddSectionPopover />
    </PopoverButton>
  );
};

AddSectionButton.defaultProps = {
  isIcon: true,
};
