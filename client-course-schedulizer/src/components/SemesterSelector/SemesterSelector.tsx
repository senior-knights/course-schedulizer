import { IconButton, Typography } from "@material-ui/core";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import React from "react";
import "./SemesterSelector.scss";

export const SemesterSelector = () => {
  return (
    <div className="semester-selector">
      <IconButton>
        <ChevronLeft />
      </IconButton>
      <Typography variant="h6">Fall</Typography>
      <IconButton>
        <ChevronRight />
      </IconButton>
    </div>
  );
};
