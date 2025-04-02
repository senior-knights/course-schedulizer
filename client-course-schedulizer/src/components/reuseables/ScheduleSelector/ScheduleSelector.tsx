import { Chip, IconButton, Paper, Tooltip, Typography } from "@material-ui/core";
import ToggleOnIcon from "@material-ui/icons/ToggleOn";
import React, { useContext, useState } from "react";
import { AppContext } from "utilities/contexts";
import "./ScheduleSelector.scss";

/**
 * Component that displays all loaded schedules and allows the user to select
 * which schedules to display in the main view.
 */
export const ScheduleSelector = () => {
  const {
    appState: { schedules, activeScheduleIds },
    appDispatch,
  } = useContext(AppContext);
  const [open, setOpen] = useState(false);

  // Hide if there are no schedules or only one schedule
  if (schedules.length <= 1) {
    return null;
  }

  const handleToggleSchedule = (scheduleId: number) => {
    // Create a new array with the changed schedule
    const updatedIds = [...activeScheduleIds];
    const index = updatedIds.indexOf(scheduleId);

    if (index === -1) {
      // Add the ID if it doesn't exist
      updatedIds.push(scheduleId);
    } else {
      // Remove the ID if it exists

      // Prevent unchecking the last active schedule
      if (updatedIds.length === 1) {
        // If this is the last active schedule, don't allow removal
        return;
      }

      updatedIds.splice(index, 1);
    }

    // Update the active schedule IDs
    appDispatch({
      payload: { activeScheduleIds: updatedIds },
      type: "setActiveScheduleIds",
    });
  };

  // Get display colors for the chips
  const getChipColor = (index: number) => {
    // A simple array of distinctive colors
    const colors = ["#4CAF50", "#2196F3", "#FF9800", "#E91E63", "#9C27B0", "#00BCD4"];
    return colors[index % colors.length];
  };

  const toggleButton = (
    <Tooltip title="Toggle Schedules">
      <IconButton className="toggle-button" onClick={() => { setOpen(!open); }}>
        <ToggleOnIcon />
        <Typography className="toggle-label" variant="button">
          Toggle Schedules
        </Typography>
      </IconButton>
    </Tooltip>
  );

  return (
    <div className="schedule-selector-wrapper">
      {toggleButton}

      <Paper className={`schedule-selector-container ${open ? 'open' : ''}`}>
        <Typography className="schedule-selector-title" variant="subtitle1">
          Toggle Schedules
        </Typography>

        <div className="schedules-chip-container">
          {schedules.map((schedule, index) => {
            // Get schedule name from file name or use default
            const scheduleName = schedule.name || `Schedule ${index + 1}`;
            const isActive = activeScheduleIds.includes(index);

            return (
              <Chip
                className={isActive ? "active-schedule" : "inactive-schedule"}
                color={isActive ? "primary" : "default"}
                key={`schedule-${index}`}
                label={scheduleName}
                onClick={() => { handleToggleSchedule(index); }}
                style={{
                  backgroundColor: isActive ? getChipColor(index) : undefined,
                  fontWeight: isActive ? 'bold' : 'normal',
                  margin: '4px',
                }}
                variant={isActive ? "default" : "outlined"}
              />
            );
          })}
        </div>
      </Paper>
    </div>
  );
};
