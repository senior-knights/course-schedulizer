import React, { useState, useEffect } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
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
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [autoSave, setAutoSave] = useState(localStorage.getItem("schedulizerAutoSave") === "true");
  const [versionError, setVersionError] = useState("");
  const [yearError, setYearError] = useState("");

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

    // Auto-save if enabled and there are changes
    if (autoSave && hasChanges) {
      const timeoutId = setTimeout(() => {
        saveToLocalStorage();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [notes, version, year, originalValues, autoSave]);

  // Save auto-save preference
  useEffect(() => {
    try {
      localStorage.setItem("schedulizerAutoSave", autoSave.toString());
    } catch (error) {
      console.error("Failed to save auto-save preference:", error);
    }
  }, [autoSave]);

  // Validate version (semantic versioning format)
  const validateVersion = (value: string) => {
    const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
    if (!semverRegex.test(value) && value !== "") {
      setVersionError("Please use semantic versioning (e.g., 1.0.0)");
      return false;
    }
    setVersionError("");
    return true;
  };

  // Validate year (current year or range format YYYY-YYYY)
  const validateYear = (value: string) => {
    const yearRegex = /^(\d{4})(?:-(\d{4}))?$/;
    if (!yearRegex.test(value) && value !== "") {
      setYearError("Use YYYY or YYYY-YYYY format");
      return false;
    }
    setYearError("");
    return true;
  };

  // Save data to localStorage with error handling
  const saveToLocalStorage = () => {
    try {
      // Validate inputs before saving
      const isVersionValid = validateVersion(version);
      const isYearValid = validateYear(year);

      if (!isVersionValid || !isYearValid) {
        return false;
      }

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
      return true;
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
      setErrorMessage("Failed to save changes. Local storage may be full or unavailable.");
      setShowError(true);
      return false;
    }
  };

  // Handle save action
  const handleSave = () => {
    const saveSuccessful = saveToLocalStorage();
    if (saveSuccessful) {
      setShowSaveSuccess(true);
    }
  };

  // Toggle auto-save feature
  const handleAutoSaveToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutoSave(event.target.checked);
  };

  // Handle closing the save success notification
  const handleCloseSnackbar = () => {
    setShowSaveSuccess(false);
  };

  // Handle closing the error notification
  const handleCloseErrorSnackbar = () => {
    setShowError(false);
  };

  return (
    <div className="meta-container">
      <div className="meta-header-simplified">
        <Typography variant="h5">Schedule Metadata</Typography>
        <div className="meta-actions">
          <div className="auto-save-toggle">
            <FormControlLabel
              control={
                <Switch
                  checked={autoSave}
                  color="primary"
                  onChange={handleAutoSaveToggle}
                />
              }
              label="Auto-save changes"
            />
            <Tooltip title="When enabled, changes will be automatically saved after 2 seconds of inactivity">
              <IconButton size="small">
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
          <Button
            className="save-button"
            color="primary"
            disabled={!hasUnsavedChanges || !!versionError || !!yearError}
            onClick={handleSave}
            startIcon={<SaveIcon />}
            variant="contained"
          >
            Save Changes
          </Button>
        </div>
      </div>
      <Typography className="meta-subtitle" variant="subtitle1">
        Add information about your schedule that will be included in exports
        {hasUnsavedChanges && (
          <span className="unsaved-indicator"> (unsaved changes)</span>
        )}
      </Typography>

      <Grid className="meta-content" columnSpacing={3} container>
        <Grid size={{ md: 8, xs: 12}}>
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

              <Grid className="meta-field-group" columnSpacing={2} container>
                <Grid size={{ sm: 6, xs: 12 }}>
                  <TextField
                    className="meta-field"
                    error={!!versionError}
                    fullWidth
                    helperText={versionError}
                    label="Version"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setVersion(newValue);
                      validateVersion(newValue);
                    }}
                    placeholder="e.g. 1.0.0"
                    value={version}
                    variant="outlined"
                  />
                </Grid>
                <Grid size={{ sm: 6, xs: 12 }}>
                  <TextField
                    className="meta-field"
                    error={!!yearError}
                    fullWidth
                    helperText={yearError}
                    label="Academic Year"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setYear(newValue);
                      validateYear(newValue);
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

        <Grid size={{ md: 4,  xs: 12 }}>
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

                <Typography
                  className="time-display"
                  variant="h3"
                >
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

      <Snackbar
        autoHideDuration={5000}
        onClose={handleCloseErrorSnackbar}
        open={showError}
      >
        <Alert onClose={handleCloseErrorSnackbar} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};
