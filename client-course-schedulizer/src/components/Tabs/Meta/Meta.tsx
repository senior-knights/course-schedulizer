import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import "./Meta.scss";

/* Creates a Meta tab for notes, version, year, and time display
 */
export const Meta = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notes, setNotes] = useState(localStorage.getItem("schedulizerNotes") || "");
  const [version, setVersion] = useState(localStorage.getItem("schedulizerVersion") || "1.0.0");
  const [year, setYear] = useState(localStorage.getItem("schedulizerYear") || new Date().getFullYear().toString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("schedulizerNotes", notes);
    localStorage.setItem("schedulizerVersion", version);
    localStorage.setItem("schedulizerYear", year);
  }, [notes, version, year]);

  return (
    <div className="meta-container">
      <Typography className="meta-title" variant="h5">Schedule Metadata</Typography>
      <Typography className="meta-subtitle" variant="subtitle1">
        Add information about your schedule that will be included in exports
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
    </div>
  );
};
