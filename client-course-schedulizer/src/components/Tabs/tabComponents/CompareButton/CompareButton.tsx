import { IconButton, Tooltip, Typography } from "@material-ui/core";
import CompareIcon from "@material-ui/icons/Compare";
import React from "react";
import { ScheduleComparer } from "../../../reuseables/ScheduleComparer/ScheduleComparer";
import "./CompareButton.scss";

/**
 * A button component for comparing schedules
 */
export const CompareButton = () => {
  return (
    <div className="compare-button-container">
      <ScheduleComparer />
    </div>
  );
};
