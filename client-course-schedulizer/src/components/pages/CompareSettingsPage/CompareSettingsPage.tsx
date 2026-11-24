// This file is for the settings page where users can select which schedules to compare and which columns to include in the comparison results.
// It includes a search bar to filter columns, and buttons to select/deselect all columns or reset to default selections.

import React, { useContext, useEffect, useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { AppContext } from "utilities/contexts";

const COLUMN_CATEGORIES = {
  DETAILS: [
    { key: "studentHours", label: "Minimum Credits" },
    { key: "maxStudentHours", label: "Maximum Credits" },
    { key: "group", label: "Group" },
    { key: "comment", label: "Comment" },
  ],
  ESSENTIAL: [
    { key: "department", label: "Department" },
    { key: "prefix", label: "Prefix" },
    { key: "number", label: "Course Number" },
    { key: "sectionLetter", label: "Section" },
    { key: "term", label: "Term" },
    { key: "semesterLength", label: "Term Part" },
    { key: "shortTitle", label: "Short Title" },
  ],
  SCHEDULE: [
    { key: "days", label: "Meeting Days" },
    { key: "startTime", label: "Start Time" },
    { key: "duration", label: "Duration" },
    { key: "location", label: "Classroom" },
    { key: "deliveryMode", label: "Delivery Mode" },
  ],
  TEACHING: [
    { key: "instructors", label: "Instructor" },
    { key: "academicYear", label: "Academic Year" },
    { key: "instructionalMethod", label: "Instructional Method" },
    { key: "courseLevel", label: "Course Level" },
    { key: "enrollment", label: "Enrollment" },
    { key: "enrollmentDay10", label: "Day 10 Enrollment" },
  ],
};

const STORAGE_KEY_SELECTED_COLUMNS = "compareSettings.selectedColumns";

// Default selected columns if no user selection or stored preferences exist
const DEFAULT_SELECTED_COLUMNS: Record<string, boolean> = {
  academicYear: false,
  comment: false,
  courseLevel: false,
  days: false,
  deliveryMode: false,
  department: false,
  duration: false,
  enrollment: false,
  enrollmentDay10: false,
  group: false,
  instructionalMethod: false,
  instructors: true,
  location: false,
  maxStudentHours: false,
  number: true,
  prefix: true,
  sectionLetter: true,
  semesterLength: false,
  shortTitle: false,
  startTime: false,
  studentHours: false,
  term: false,
};

const loadStoredSelectedColumns = (): Record<string, boolean> | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_SELECTED_COLUMNS);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const CompareSettingsPage = () => {
  const history = useHistory();
  const location = useLocation();
  const {
    appState: { schedules },
  } = useContext(AppContext);

  const query = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  const defaultReference = Number(query.get("ref") ?? "0");
  const defaultComparison = Number(query.get("comp") ?? "1");

  const [referenceScheduleId] = useState<number>(
    Math.max(0, Math.min(defaultReference, schedules.length - 1)),
  );
  const [comparisonScheduleId] = useState<number>(
    Math.max(0, Math.min(defaultComparison, schedules.length - 1)),
  );
  const [searchQuery, setSearchQuery] = useState<string>("");


  const initialSelectedColumns = useMemo(() => {
    // 1. Get columns from URL query parameters (highest priority)
    const rawColumns = query.get("columns") || "";
    const parsedColumns = rawColumns
      .split(",")
      .map((item) => {return decodeURIComponent(item.trim());})
      .filter(Boolean);

    // 2. If URL has valid columns, use them (this will override stored preferences)
    if (parsedColumns.length > 0) {
      const selectedFromUrl = { ...DEFAULT_SELECTED_COLUMNS };
      // 先把所有设为 false，确保只选中 URL 里有的
      Object.keys(selectedFromUrl).forEach(key => {selectedFromUrl[key] = false;});

      parsedColumns.forEach((column) => {
        if (column in selectedFromUrl) {
          selectedFromUrl[column] = true;
        }
      });
      return selectedFromUrl;
    }

    // 3. If URL has no parameters, try to read from local storage (only if URL doesn't specify columns, to avoid conflict)
    const stored = loadStoredSelectedColumns();
    if (stored) {
      // Directly merge: use the stored state to override the default state
      return { ...DEFAULT_SELECTED_COLUMNS, ...stored };
    }

    // 4. If neither URL nor local storage has valid data, use the hardcoded defaults
    return DEFAULT_SELECTED_COLUMNS;
  }, [query]);


  const [selectedColumns, setSelectedColumns] = useState<Record<string, boolean>>(initialSelectedColumns);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY_SELECTED_COLUMNS, JSON.stringify(selectedColumns));
    } catch {
      // ignore localStorage write errors
    }
  }, [selectedColumns]);

  const selectedColumnsArray = useMemo(() => {
    return Object.entries(selectedColumns)
      .filter(([, value]) => {
        return value;
      })
      .map(([key]) => {
        return key;
      });
  }, [selectedColumns]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return COLUMN_CATEGORIES;
    }

    const filtered: Record<string, typeof COLUMN_CATEGORIES[keyof typeof COLUMN_CATEGORIES]> = {};

    Object.entries(COLUMN_CATEGORIES).forEach(([category, columns]) => {
      const matched = columns.filter((column) => {
        return (
          column.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          column.key.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      if (matched.length > 0) {
        filtered[category] = matched;
      }
    });

    return filtered;
  }, [searchQuery]);

  const canCompare =
    schedules.length > 1 &&
    referenceScheduleId !== comparisonScheduleId &&
    selectedColumnsArray.length > 0;

  return (
    <Box p={3}>
      <Typography gutterBottom variant="h4">
        Comparison settings
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Select comparison columns, then click Show Comparison.
      </Typography>

      <Grid container spacing={3} sx={{ justifyContent: "center" }}>
        <Grid size={{ md: 8, xs: 12 }}>
          <Paper elevation={1} sx={{ padding: 16 }}>
            <Typography gutterBottom variant="subtitle1">
              Comparison columns
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              onChange={(event) => {
                setSearchQuery(event.target.value);
              }}
              placeholder="Search columns"
              slotProps={{
                input: {
                  startAdornment: (
                    <SearchIcon
                      color="action"
                      fontSize="small"
                      sx={{ mr: 1 }}
                    />
                  ),
                },
              }}
              value={searchQuery}
              variant="outlined"
            />

            <Box mb={2} sx={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <Button
                onClick={() => {
                  const next = { ...selectedColumns };
                  Object.keys(next).forEach((key) => {
                    next[key] = true;
                  });
                  setSelectedColumns(next);
                }}
                size="small"
                variant="outlined"
              >
                Select all
              </Button>
              <Button
                onClick={() => {
                  const next = { ...selectedColumns };
                  Object.keys(next).forEach((key) => {
                    next[key] = false;
                  });
                  setSelectedColumns(next);
                }}
                size="small"
                variant="outlined"
              >
                Clear all
              </Button>
              <Button
                onClick={() => {
                  const next = { ...DEFAULT_SELECTED_COLUMNS };
                  setSelectedColumns(next);
                }}
                size="small"
                variant="outlined"
              >
                Reset default
              </Button>
            </Box>

            {Object.entries(filteredCategories).map(([category, columns]) => {
              return (
                <Box key={category} mb={2}>
                  <Typography gutterBottom variant="subtitle2">
                    {category === "ESSENTIAL"
                      ? "Essential"
                      : category === "TEACHING"
                      ? "Teaching"
                      : category === "SCHEDULE"
                      ? "Schedule"
                      : "Details"}
                  </Typography>
                  <Divider />
                  <Grid container spacing={1} sx={{ marginTop: 8 }}>
                    {columns.map((column) => {
                      return (
                        <Grid key={column.key} size={{ md: 4, sm: 4, xs: 6 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={Boolean(selectedColumns[column.key])}
                                onChange={() => {
                                  setSelectedColumns((prev) => {
                                    return {
                                      ...prev,
                                      [column.key]: !prev[column.key],
                                    };
                                  });
                                }}
                                size="small"
                              />
                            }
                            label={column.label}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              );
            })}
          </Paper>
        </Grid>
      </Grid>

      <Box mt={3}>
        <Button
          color="primary"
          disabled={!canCompare}
          onClick={() => {
            history.push(
              `/compare-results?ref=${referenceScheduleId}&comp=${comparisonScheduleId}&columns=${selectedColumnsArray
                .map(encodeURIComponent)
                .join(",")}`,
            );
          }}
          variant="contained"
        >
          Show Comparison
        </Button>
      </Box>
    </Box>
  );
};
