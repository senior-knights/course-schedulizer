import { Chip, IconButton, Menu, Tooltip, Typography } from "@material-ui/core";
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Hide if there are no schedules or only one schedule
  if (schedules.length <= 1) {
    return null;
  }

  const handleToggleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggleSchedule = (scheduleId: number, event: React.MouseEvent) => {
    event.stopPropagation();

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
    const colors = ["#4CAF50", "#2196F3", "#FF9800", "#E91E63", "#9C27B0", "#00BCD4", "#607D8B", "#795548", "#8BC34A", "#3F51B5"];
    return colors[index % colors.length];
  };

  // Display count of active/total schedules
  const scheduleCounter = `${activeScheduleIds.length}/${schedules.length}`;

  const toggleButton = (
    <Tooltip title="Toggle Schedules">
      <IconButton className="toggle-button" onClick={handleToggleOpen}>
        <ToggleOnIcon />
        <Typography className="toggle-label" variant="button">
          Toggle Schedules <span className="schedule-counter">({scheduleCounter})</span>
        </Typography>
      </IconButton>
    </Tooltip>
  );

  return (
    <div className="schedule-selector-wrapper">
      {toggleButton}

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'top',
        }}
        className="schedules-menu"
        getContentAnchorEl={null}
        id="schedules-menu"
        keepMounted
        onClose={handleClose}
        open={Boolean(anchorEl)}
        transformOrigin={{
          horizontal: 'center',
          vertical: 'bottom',
        }}
      >
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
                onClick={(event) => { handleToggleSchedule(index, event); }}
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
      </Menu>
    </div>
  );
};
