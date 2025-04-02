import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Paper, Typography } from "@material-ui/core";
import React, { useContext } from "react";
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

  return (
    <Paper className="schedule-selector-container">
      <FormControl component="fieldset">
        <FormLabel component="legend">
          <Typography variant="subtitle1">Toggle Schedules</Typography>
        </FormLabel>
        <FormGroup>
          {schedules.map((schedule, index) => {
            // Get schedule name from file name or use default
            const scheduleName = schedule.name || `Schedule ${index + 1}`;

            return (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={activeScheduleIds.includes(index)}
                    color="primary"
                    onChange={() => {
                      handleToggleSchedule(index);
                    }}
                  />
                }
                key={`schedule-${index}`}
                label={scheduleName}
              />
            );
          })}
        </FormGroup>
      </FormControl>
    </Paper>
  );
};
