import { Chip, IconButton, Menu, Tooltip, Typography, makeStyles } from "@material-ui/core";
import ToggleOnIcon from "@material-ui/icons/ToggleOn";
import React, { useContext, useState, useCallback, useMemo } from "react";
import { AppContext } from "utilities/contexts";
import "./ScheduleSelector.scss";

// Define styles using makeStyles for better organization
const useStyles = makeStyles((theme) => {
  return {
    activeChip: {
      fontWeight: 'bold',
      margin: '4px',
    },
    chipContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      maxWidth: '400px',
      padding: theme.spacing(1),
    },
    inactiveChip: {
      margin: '4px',
    },
    scheduleCounter: {
      backgroundColor: theme.palette.grey[200],
      borderRadius: '10px',
      fontSize: '0.75rem',
      marginLeft: theme.spacing(0.5),
      padding: theme.spacing(0.25, 0.75),
    },
    toggleButton: {
      '&:hover': {
        backgroundColor: '#e0e0e0',
      },
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      border: 'none',
      borderRadius: '20px',
      display: 'flex',
      padding: '5px 12px',
      transition: 'background-color 0.2s',
    },
    toggleIcon: {
      marginRight: theme.spacing(0.5),
    },
    toggleLabel: {
      alignItems: 'center',
      display: 'flex',
      fontSize: '14px',
      fontWeight: 500,
      marginLeft: '8px',
      whiteSpace: 'nowrap',
    },
  };
});

/**
 * Component that displays all loaded schedules and allows the user to select
 * which schedules to display in the main view.
 */
export const ScheduleSelector: React.FC = () => {
  const classes = useStyles();
  const {
    appState: { schedules, activeScheduleIds },
    appDispatch,
  } = useContext(AppContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Memoize the color mapping function to avoid recreating on each render
  const getChipColor = useCallback((index: number): string => {
    // A simple array of distinctive colors
    const colors = ["#4CAF50", "#2196F3", "#FF9800", "#E91E63", "#9C27B0", "#00BCD4", "#607D8B", "#795548", "#8BC34A", "#3F51B5"];
    return colors[index % colors.length];
  }, []);

  // Handle opening the toggle menu
  const handleToggleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  // Handle closing the toggle menu
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  /**
   * Toggle a schedule's active state
   * @param scheduleId The ID of the schedule to toggle
   * @param event The mouse event
   */
  const handleToggleSchedule = useCallback((scheduleId: number, event: React.MouseEvent) => {
    event.stopPropagation();

    // Create a new array with the changed schedule
    const updatedIds = [...activeScheduleIds];
    const index = updatedIds.indexOf(scheduleId);

    if (index === -1) {
      // Add the ID if it doesn't exist
      updatedIds.push(scheduleId);
    } else {
      // Prevent unchecking the last active schedule
      if (updatedIds.length === 1) {
        return;
      }

      // Remove the ID if it exists
      updatedIds.splice(index, 1);
    }

    // Update the active schedule IDs
    appDispatch({
      payload: { activeScheduleIds: updatedIds },
      type: "setActiveScheduleIds",
    });
  }, [activeScheduleIds, appDispatch]);

  // Display count of active/total schedules
  const scheduleCounter = useMemo(() => {
    return `${activeScheduleIds.length}/${schedules.length}`;
  }, [activeScheduleIds.length, schedules.length]);

  // Build the toggle button with counter
  const toggleButton = useMemo(() => {
    return (
      <Tooltip title="Toggle Schedules">
        <IconButton className={classes.toggleButton} onClick={handleToggleOpen}>
          <ToggleOnIcon className={classes.toggleIcon} />
          <Typography className={classes.toggleLabel} variant="button">
            TOGGLE&nbsp;SCHEDULES <span className={classes.scheduleCounter}>{scheduleCounter}</span>
          </Typography>
        </IconButton>
      </Tooltip>
    );
  }, [classes, handleToggleOpen, scheduleCounter]);

  // Hide if there are no schedules or only one schedule
  if (schedules.length <= 1) {
    return null;
  }

  return (
    <div className="schedule-selector-wrapper">
      {toggleButton}

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'top',
        }}
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
        <div className={classes.chipContainer}>
          {schedules.map((schedule, index) => {
            // Get schedule name from file name or use default
            const scheduleName = schedule.name || `Schedule ${index + 1}`;
            const isActive = activeScheduleIds.includes(index);

            return (
              <Chip
                className={isActive ? classes.activeChip : classes.inactiveChip}
                color={isActive ? "primary" : "default"}
                key={`schedule-${index}`}
                label={scheduleName}
                onClick={(event) => { handleToggleSchedule(index, event); }}
                style={{
                  backgroundColor: isActive ? getChipColor(index) : undefined,
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
