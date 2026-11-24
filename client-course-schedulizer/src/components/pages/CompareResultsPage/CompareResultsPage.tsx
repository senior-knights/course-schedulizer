// This component is used to display the results of comparing two schedules based on user-selected fields. It groups schedule entries by the selected fields and shows the faculty load and row count for each group in both schedules, along with the differences.

import React, { useCallback, useContext, useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { AppContext } from "utilities/contexts";
import { flattenSchedule } from "utilities/services";

const FIELD_LABELS: Record<string, string> = {
  academicYear: "Academic Year",
  anticipatedSize: "Enrollment",
  comment: "Comment",
  courseLevel: "Course Level",
  days: "Days",
  deliveryMode: "Delivery Mode",
  department: "Department",
  duration: "Duration",
  enrollment: "Enrollment",
  enrollmentDay10: "Day 10 Enrollment",
  facultyHours: "Faculty Load",
  group: "Group",
  instructionalMethod: "Instructional Method",
  instructors: "Instructor",
  location: "Location",
  maxStudentHours: "Maximum Credits",
  number: "Course Number",
  prefix: "Prefix",
  sectionLetter: "Section",
  semesterLength: "Term Part",
  shortTitle: "Short Title",
  startTime: "Start Time",
  studentHours: "Student Hours",
  term: "Term",
};

const getDisplayValue = (row: any, field: string) => {
  const value = row[field];
  if (value === undefined || value === null) return "";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
};

const getNumberValue = (row: any, field: string) => {
  const value = row[field];
  if (typeof value === "number") return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const CompareResultsPage = () => {
  const history = useHistory();
  const location = useLocation();
  const {
    appState: { schedules },
  } = useContext(AppContext);

  const query = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  const referenceScheduleId = Number(query.get("ref") ?? "-1");
  const comparisonScheduleId = Number(query.get("comp") ?? "-1");

  const selectedColumns = useMemo(() => {
    const raw = query.get("columns") || "";
    return raw
      .split(",")
      .map((item) => {
        return decodeURIComponent(item.trim());
      })
      .filter((value) => {
        return Boolean(value) && value !== "facultyHours";
      });
  }, [query]);

  const referenceSchedule = schedules[referenceScheduleId];
  const comparisonSchedule = schedules[comparisonScheduleId];
  const [onlyShowFacultyLoadDifference, setOnlyShowFacultyLoadDifference] = useState(false);
  const [onlyShowRowDifference, setOnlyShowRowDifference] = useState(false);

  const hasValidInput =
    Boolean(referenceSchedule) &&
    Boolean(comparisonSchedule) &&
    referenceScheduleId !== comparisonScheduleId &&
    selectedColumns.length > 0;

  const referenceRows = useMemo(() => {
    return hasValidInput ? flattenSchedule(referenceSchedule) : [];
  }, [hasValidInput, referenceSchedule]);

  const comparisonRows = useMemo(() => {
    return hasValidInput ? flattenSchedule(comparisonSchedule) : [];
  }, [hasValidInput, comparisonSchedule]);

  const buildGroupValues = useCallback((row: any) => {
    if (selectedColumns.length === 0) {
      return ["Entry"];
    }

    return selectedColumns.map((column) => {
      return getDisplayValue(row, column);
    });
  }, [selectedColumns]);

  const groupSections = useMemo(() => {
    if (!hasValidInput) return [];

    const sections = new Map<
      string,
      {
        facultyLoad1: number;
        facultyLoad2: number;
        groupValues: string[];
        row1: number;
        row2: number;
      }
    >();

    const addRow = (row: any, isReference: boolean) => {
      const values = buildGroupValues(row);
      const key = JSON.stringify(values);
      const existing = sections.get(key) ?? {
        facultyLoad1: 0,
        facultyLoad2: 0,
        groupValues: values,
        row1: 0,
        row2: 0,
      };

      if (isReference) {
        existing.row1 += 1;
        existing.facultyLoad1 += getNumberValue(row, "facultyHours");
      } else {
        existing.row2 += 1;
        existing.facultyLoad2 += getNumberValue(row, "facultyHours");
      }

      sections.set(key, existing);
    };

    referenceRows.forEach((row) => {
      addRow(row, true);
    });
    comparisonRows.forEach((row) => {
      addRow(row, false);
    });

    return Array.from(sections.values()).map((section) => {
      return {
        ...section,
        facultyLoadDifference: section.facultyLoad2 - section.facultyLoad1,
        rowDifference: section.row2 - section.row1,
      };
    });
  }, [buildGroupValues, comparisonRows, hasValidInput, referenceRows]);

  const selectedLabelText = selectedColumns
    .map((column) => {
      return FIELD_LABELS[column] || column;
    })
    .join(", ");

  const filteredGroupSections = useMemo(() => {
    return groupSections.filter((item) => {
      if (onlyShowFacultyLoadDifference && item.facultyLoadDifference === 0) {
        return false;
      }

      if (onlyShowRowDifference && item.rowDifference === 0) {
        return false;
      }

      return true;
    });
  }, [groupSections, onlyShowFacultyLoadDifference, onlyShowRowDifference]);

  if (!hasValidInput) {
    return (
      <Box p={3}>
        <Typography gutterBottom variant="h5">
          Compare schedules
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          Invalid comparison settings. Choose two different schedules and at least one compare item.
        </Typography>
        <Button
          color="primary"
          onClick={() => {
            history.push("/compare-settings");
          }}
          variant="contained"
        >
          Back to comparison settings
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" flexWrap="wrap" justifyContent="space-between" mb={3}>
        <Box maxWidth={720}>
          <Typography gutterBottom variant="h4">
            Schedule comparison results
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            Compare flattened schedule entries and the selected fields.
          </Typography>
          <Typography color="text.secondary">
            {referenceSchedule.name || `Schedule ${referenceScheduleId + 1}`} vs. {comparisonSchedule.name || `Schedule ${comparisonScheduleId + 1}`}.
          </Typography>
          <Typography color="text.secondary">Selected compare items: {selectedLabelText}</Typography>
        </Box>
        <Box alignItems="center" display="flex" mt={1} sx={{ gap: 8 }}>
          <Button
            color="inherit"
            onClick={() => {
              history.push(
                `/compare-settings?ref=${referenceScheduleId}&comp=${comparisonScheduleId}
                  .map(encodeURIComponent)
                  .join(",")}`,
              );
            }}
            variant="outlined"
          >
            Modify comparison settings
          </Button>
        </Box>
      </Box>

      <Box mb={4}>
        <Typography variant="h6">Comparison results</Typography>
        <TableContainer component={Paper} elevation={1}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {selectedColumns.map((column) => {
                  return <TableCell key={column}>{FIELD_LABELS[column] || column}</TableCell>;
                })}
                <TableCell align="right">Schedule 1 Faculty Load</TableCell>
                <TableCell align="right">Schedule 2 Faculty Load</TableCell>
                <TableCell align="right">
                  <Box alignItems="flex-end" display="flex" flexDirection="column" sx={{ lineHeight: 1.1 }}>
                    <Typography component="span" variant="body2">
                      Faculty Load Difference
                    </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={onlyShowFacultyLoadDifference}
                          color="primary"
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setOnlyShowFacultyLoadDifference(event.target.checked);
                          }}
                          size="small"
                        />
                      }
                      label={<Typography variant="caption">difference only</Typography>}
                      sx={{ marginRight: 0, marginTop: -2 }}
                    />
                  </Box>
                </TableCell>
                <TableCell align="right">Schedule 1 Rows</TableCell>
                <TableCell align="right">Schedule 2 Rows</TableCell>
                <TableCell align="right">
                  <Box alignItems="flex-end" display="flex" flexDirection="column" sx={{ lineHeight: 1.1 }}>
                    <Typography component="span" variant="body2">
                      Row Difference
                    </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={onlyShowRowDifference}
                          color="primary"
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setOnlyShowRowDifference(event.target.checked);
                          }}
                          size="small"
                        />
                      }
                      label={<Typography variant="caption">difference only</Typography>}
                      sx={{ marginRight: 0, marginTop: -2 }}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredGroupSections.map((item) => {
                return (
                  <TableRow key={item.groupValues.join("|")}>
                    {item.groupValues.map((value, index) => {
                      return <TableCell key={`${item.groupValues.join("|")}-${index}`}>{value || "—"}</TableCell>;
                    })}
                    <TableCell align="right">{item.facultyLoad1}</TableCell>
                    <TableCell align="right">{item.facultyLoad2}</TableCell>
                    <TableCell align="right">
                      {item.facultyLoadDifference > 0 && `+${item.facultyLoadDifference}`}
                      {item.facultyLoadDifference === 0 && "0"}
                      {item.facultyLoadDifference < 0 && item.facultyLoadDifference}
                    </TableCell>
                    <TableCell align="right">{item.row1}</TableCell>
                    <TableCell align="right">{item.row2}</TableCell>
                    <TableCell align="right">
                      {item.rowDifference > 0 && `+${item.rowDifference}`}
                      {item.rowDifference === 0 && "0"}
                      {item.rowDifference < 0 && item.rowDifference}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
