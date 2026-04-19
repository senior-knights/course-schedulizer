import { IconButton, Tooltip, Typography } from "@material-ui/core";
import CompareIcon from "@material-ui/icons/Compare";
import React from "react";
import { useHistory } from "react-router-dom";
import "./CompareButton.scss";

/**
 * A button component for comparing schedules
 */
export const CompareButton = () => {
  const history = useHistory();

  return (
    <div className="compare-button-container">
      <Tooltip title="Compare Schedules">
        <IconButton onClick={() => {return history.push("/compare-settings")}}>
          <CompareIcon />
          <Typography variant="button">COMPARE SCHEDULES</Typography>
        </IconButton>
      </Tooltip>
    </div>
  );
};
