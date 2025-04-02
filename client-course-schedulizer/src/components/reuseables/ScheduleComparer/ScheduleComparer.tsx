import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@material-ui/core";
import CompareIcon from "@material-ui/icons/Compare";
import React, { useContext, useState } from "react";
import { AppContext } from "utilities/contexts";
import { Schedule } from "utilities/interfaces";
import { compareSchedules, exportComparisonToExcel } from "utilities/services";
import "./ScheduleComparer.scss";

/**
 * Component that allows users to compare two schedules and export the differences
 */
export const ScheduleComparer = () => {
  const {
    appState: { schedules },
  } = useContext(AppContext);

  const [open, setOpen] = useState(false);
  const [referenceScheduleId, setReferenceScheduleId] = useState<number>(-1);
  const [comparisonScheduleId, setComparisonScheduleId] = useState<number>(-1);
  const [selectedColumns, setSelectedColumns] = useState<{
    [key: string]: boolean;
  }>({
    academicYear: false,
    comment: false,
    courseLevel: false,
    days: false,
    deliveryMode: false,
    department: true,
    duration: false,
    enrollment: false,
    enrollmentDay10: false,
    facultyHours: false,
    group: false,
    instructionalMethod: false,
    instructors: true,
    location: false,
    maxStudentHours: false,
    number: true,
    prefix: true,
    sectionLetter: true,
    semesterLength: true,
    shortTitle: false,
    startTime: false,
    studentHours: false,
    term: true,
  });

  // Hide if there are fewer than 2 schedules
  if (schedules.length < 2) {
    return null;
  }

  const handleToggleColumn = (column: string) => {
    setSelectedColumns({
      ...selectedColumns,
      [column]: !selectedColumns[column],
    });
  };

  const handleExportComparison = () => {
    if (referenceScheduleId >= 0 && comparisonScheduleId >= 0) {
      const referenceSchedule = schedules[referenceScheduleId];
      const comparisonSchedule = schedules[comparisonScheduleId];

      const columnsToCompare = Object.keys(selectedColumns).filter((column) => {
        return selectedColumns[column];
      });

      exportComparisonToExcel(
        referenceSchedule,
        comparisonSchedule,
        columnsToCompare,
      );

      setOpen(false);
    }
  };

  const handleOpen = () => {
    // Set default values when opening
    if (referenceScheduleId === -1 && schedules.length > 0) {
      setReferenceScheduleId(0);
    }
    if (comparisonScheduleId === -1 && schedules.length > 1) {
      setComparisonScheduleId(1);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Compare Schedules">
        <IconButton className="compare-button" onClick={handleOpen}>
          <CompareIcon />
          <Typography className="compare-label" variant="button">
            COMPARE&nbsp;SCHEDULES
          </Typography>
        </IconButton>
      </Tooltip>

      <Dialog
        className="compare-dialog"
        fullWidth
        maxWidth="md"
        onClose={handleClose}
        open={open}
      >
        <DialogTitle>
          Compare Schedules
        </DialogTitle>

        <DialogContent>
          <div className="schedule-comparer-form">
            <div className="schedule-selector-section">
              <FormControl fullWidth margin="normal">
                <FormLabel>Reference Schedule</FormLabel>
                <Select
                  onChange={(e) => {
                    return setReferenceScheduleId(e.target.value as number);
                  }}
                  value={referenceScheduleId}
                >
                  {schedules.map((schedule, index) => {
                    return (
                      <MenuItem
                        disabled={index === comparisonScheduleId}
                        key={`ref-${index}`}
                        value={index}
                      >
                        {schedule.name || `Schedule ${index + 1}`}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <FormLabel>Comparison Schedule</FormLabel>
                <Select
                  onChange={(e) => {
                    return setComparisonScheduleId(e.target.value as number);
                  }}
                  value={comparisonScheduleId}
                >
                  {schedules.map((schedule, index) => {
                    return (
                      <MenuItem
                        disabled={index === referenceScheduleId}
                        key={`comp-${index}`}
                        value={index}
                      >
                        {schedule.name || `Schedule ${index + 1}`}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>

            <div className="column-selector-section">
              <FormControl
                component="fieldset"
                size="small"
              >
                <FormLabel component="legend">
                  Select columns to match rows (identical values in these columns will be considered the same row)
                </FormLabel>
                <FormGroup>
                  <div className="column-checkboxes">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedColumns.department}
                          onChange={() => {
                            return handleToggleColumn("department");
                          }}
                        />
                      }
                      label="Department"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedColumns.academicYear}
                          onChange={() => {
                            return handleToggleColumn("academicYear");
                          }}
                        />
                      }
                      label="AcademicYear"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedColumns.prefix}
                          onChange={() => {
                            return handleToggleColumn("prefix");
                          }}
                        />
                      }
                      label="Prefix"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedColumns.number}
                          onChange={() => {
                            return handleToggleColumn("number");
                          }}
                        />
                      }
                      label="Course Number"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedColumns.sectionLetter}
                          onChange={() => {
                            return handleToggleColumn("sectionLetter");
                          }}
                        />
                      }
                      label="Section"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedColumns.instructors}
                          onChange={() => {
                            return handleToggleColumn("instructors");
                          }}
                        />
                      }
                      label="Faculty"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedColumns.term}
                          onChange={() => {
                            return handleToggleColumn("term");
                          }}
                        />
                      }
                      label="Term"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedColumns.semesterLength}
                          onChange={() => {
                            return handleToggleColumn("semesterLength");
                          }}
                        />
                      }
                      label="TermPart"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedColumns.days}
                          onChange={() => {
                            return handleToggleColumn("days");
                          }}
                        />
                      }
                      label="MeetingDays"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedColumns.startTime}
                          onChange={() => {
                            return handleToggleColumn("startTime");
                          }}
                        />
                      }
                      label="StartTime"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedColumns.duration}
                          onChange={() => {
                            return handleToggleColumn("duration");
                          }}
                        />
                      }
                      label="MeetingDuration"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedColumns.location}
                          onChange={() => {
                            return handleToggleColumn("location");
                          }}
                        />
                      }
                      label="Classroom"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedColumns.facultyHours}
                          onChange={() => {
                            return handleToggleColumn("facultyHours");
                          }}
                        />
                      }
                      label="FacultyLoad"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedColumns.studentHours}
                          onChange={() => {
                            return handleToggleColumn("studentHours");
                          }}
                        />
                      }
                      label="MinimumCredits"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedColumns.maxStudentHours}
                          onChange={() => {
                            return handleToggleColumn("maxStudentHours");
                          }}
                        />
                      }
                      label="MaximumCredits"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedColumns.shortTitle}
                          onChange={() => {
                            return handleToggleColumn("shortTitle");
                          }}
                        />
                      }
                      label="ShortTitle"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedColumns.instructionalMethod}
                          onChange={() => {
                            return handleToggleColumn("instructionalMethod");
                          }}
                        />
                      }
                      label="InstructionalMethod"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedColumns.courseLevel}
                          onChange={() => {
                            return handleToggleColumn("courseLevel");
                          }}
                        />
                      }
                      label="CourseLevel"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedColumns.group}
                          onChange={() => {
                            return handleToggleColumn("group");
                          }}
                        />
                      }
                      label="Group"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedColumns.deliveryMode}
                          onChange={() => {
                            return handleToggleColumn("deliveryMode");
                          }}
                        />
                      }
                      label="DeliveryMode"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedColumns.comment}
                          onChange={() => {
                            return handleToggleColumn("comment");
                          }}
                        />
                      }
                      label="Comment"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedColumns.enrollment}
                          onChange={() => {
                            return handleToggleColumn("enrollment");
                          }}
                        />
                      }
                      label="Enrollment"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedColumns.enrollmentDay10}
                          onChange={() => {
                            return handleToggleColumn("enrollmentDay10");
                          }}
                        />
                      }
                      label="EnrollmentDay10"
                    />
                  </div>
                </FormGroup>
              </FormControl>
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <Button color="default" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={referenceScheduleId < 0 || comparisonScheduleId < 0}
            onClick={handleExportComparison}
            variant="contained"
          >
            Export Comparison
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
