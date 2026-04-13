import { IconButton, Tooltip, Typography } from "@mui/material";
import CompareIcon from "@mui/icons-material/Compare";
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
