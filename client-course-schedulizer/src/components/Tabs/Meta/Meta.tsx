import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import Alert from "@material-ui/lab/Alert";
import "./Meta.scss";

/* Creates a Meta tab for notes, version, year, and time display
 */
export const Meta = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notes, setNotes] = useState(localStorage.getItem("schedulizerNotes") || "");
  const [version, setVersion] = useState(localStorage.getItem("schedulizerVersion") || "1.0.0");
  const [year, setYear] = useState(localStorage.getItem("schedulizerYear") || new Date().getFullYear().toString());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Store original values for comparison
  const [originalValues, setOriginalValues] = useState({
    notes: localStorage.getItem("schedulizerNotes") || "",
    version: localStorage.getItem("schedulizerVersion") || "1.0.0",
    year: localStorage.getItem("schedulizerYear") || new Date().getFullYear().toString(),
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  // Check for unsaved changes when data changes
  useEffect(() => {
    const hasChanges =
      notes !== originalValues.notes ||
      version !== originalValues.version ||
      year !== originalValues.year;

    setHasUnsavedChanges(hasChanges);
  }, [notes, version, year, originalValues]);

  // Handle save action
  const handleSave = () => {
    localStorage.setItem("schedulizerNotes", notes);
    localStorage.setItem("schedulizerVersion", version);
    localStorage.setItem("schedulizerYear", year);

    // Update original values to match current values
    setOriginalValues({
      notes,
      version,
      year,
    });

    setHasUnsavedChanges(false);
    setShowSaveSuccess(true);
  };

  // Handle closing the save success notification
  const handleCloseSnackbar = () => {
    setShowSaveSuccess(false);
  };

  return (
    <div className="meta-container">
      <div className="meta-header">
        <h3>Schedule Metadata</h3>
        <Button
          color="primary"
          disabled={!hasUnsavedChanges}
          onClick={handleSave}
          startIcon={<SaveIcon />}
          variant="contained"
        >
          Save Changes
        </Button>
      </div>
      <Typography className="meta-subtitle" variant="subtitle1">
        Add information about your schedule that will be included in exports
        {hasUnsavedChanges && (
          <span className="unsaved-indicator"> (unsaved changes)</span>
        )}
      </Typography>

      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <Card className="meta-card">
            <CardContent>
              <Typography className="section-title" variant="h6">General Information</Typography>
              <Divider className="section-divider" />

              <TextField
                className="meta-field"
                fullWidth
                label="Notes"
                multiline
                onChange={(e) => {
                  setNotes(e.target.value);
                }}
                placeholder="Add any additional information about this schedule"
                rows={4}
                value={notes}
                variant="outlined"
              />

              <Grid className="meta-field-group" container spacing={2}>
                <Grid item sm={6} xs={12}>
                  <TextField
                    className="meta-field"
                    fullWidth
                    label="Version"
                    onChange={(e) => {
                      setVersion(e.target.value);
                    }}
                    placeholder="e.g. 1.0.0"
                    value={version}
                    variant="outlined"
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    className="meta-field"
                    fullWidth
                    label="Academic Year"
                    onChange={(e) => {
                      setYear(e.target.value);
                    }}
                    placeholder="e.g. 2023-2024"
                    value={year}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item md={4} xs={12}>
          <Card className="meta-card time-card">
            <CardContent>
              <Typography className="section-title" variant="h6">Current Time</Typography>
              <Divider className="section-divider" />

              <div className="time-section">
                <Typography className="date-display" variant="body1">
                  {currentTime.toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    weekday: 'long',
                    year: 'numeric',
                  })}
                </Typography>

                <Typography className="time-display" variant="h3">
                  {currentTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    hour12: true,
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        open={showSaveSuccess}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Changes saved successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};
