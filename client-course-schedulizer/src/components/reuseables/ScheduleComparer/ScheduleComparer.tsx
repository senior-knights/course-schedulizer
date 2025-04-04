import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import CompareIcon from "@material-ui/icons/Compare";
import SearchIcon from "@material-ui/icons/Search";
import InfoIcon from "@material-ui/icons/Info";
import GetAppIcon from "@material-ui/icons/GetApp";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import React, { useContext, useState, useMemo, useCallback } from "react";
import { AppContext } from "utilities/contexts";
import { Schedule } from "utilities/interfaces";
import { compareSchedules, exportComparisonToExcel } from "utilities/services";
import "./ScheduleComparer.scss";

// Define a type for comparison result status
type ResultStatus = 'modified' | 'removed' | 'added' | 'unchanged';

// Define a type for comparison result
interface ComparisonResult {
  count?: number;
  differences: string[];
  row: Record<string, any>;
  status: ResultStatus;
  totalFacultyLoad?: number;
}

// Maximum number of preview results to show
const MAX_PREVIEW_RESULTS = 100;
const DEFAULT_PREVIEW_RESULTS = 25;

// Status display order priority (lower index = higher priority)
const STATUS_PRIORITY: ResultStatus[] = ['modified', 'removed', 'added', 'unchanged'];

// Category definitions for organizing checkboxes
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
    { key: "duration", label: "Meeting Duration" },
    { key: "location", label: "Classroom" },
    { key: "deliveryMode", label: "Delivery Mode" },
  ],
  TEACHING: [
    { key: "instructors", label: "Instructor" },
    { key: "academicYear", label: "Academic Year" },
    { key: "facultyHours", label: "Faculty Load" },
    { key: "instructionalMethod", label: "Instructional Method" },
    { key: "courseLevel", label: "Course Level" },
    { key: "enrollment", label: "Enrollment" },
    { key: "enrollmentDay10", label: "Day 10 Enrollment" },
  ],
};

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
  const [activeTab, setActiveTab] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [previewResults, setPreviewResults] = useState<ComparisonResult[]>([]);
  const [showAllResults, setShowAllResults] = useState<boolean>(false);
  const [summaryStats, setSummaryStats] = useState<{
    added: number;
    modified: number;
    removed: number;
    total: number;
    unchanged: number;
  }>({
    added: 0,
    modified: 0,
    removed: 0,
    total: 0,
    unchanged: 0,
  });
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

  // Calculate selected column count by category
  const selectedCountByCategory = useMemo(() => {
    const counts: Record<string, { selected: number, total: number }> = {};

    Object.entries(COLUMN_CATEGORIES).forEach(([category, columns]) => {
      const selectedCount = columns.filter(col => {
        return selectedColumns[col.key];
      }).length;
      counts[category] = {
        selected: selectedCount,
        total: columns.length,
      };
    });

    return counts;
  }, [selectedColumns]);

  // Handle tab change
  const handleTabChange = useCallback((_: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  }, []);

  // Handle toggling all columns in a category
  const handleToggleCategory = useCallback((category: string) => {
    const categoryColumns = COLUMN_CATEGORIES[category as keyof typeof COLUMN_CATEGORIES].map(col => {
      return col.key;
    });
    const allSelected = categoryColumns.every(col => {
      return selectedColumns[col];
    });

    const updatedColumns = { ...selectedColumns };
    categoryColumns.forEach(col => {
      updatedColumns[col] = !allSelected;
    });

    setSelectedColumns(updatedColumns);
  }, [selectedColumns]);

  // Filter columns based on search
  const filteredColumns = useMemo(() => {
    if (!searchQuery.trim()) return COLUMN_CATEGORIES;

    const filteredCategories: Record<string, typeof COLUMN_CATEGORIES[keyof typeof COLUMN_CATEGORIES]> = {};

    Object.entries(COLUMN_CATEGORIES).forEach(([category, columns]) => {
      const filtered = columns.filter(col => {
        return col.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        col.key.toLowerCase().includes(searchQuery.toLowerCase());
      });

      if (filtered.length > 0) {
        filteredCategories[category] = filtered;
      }
    });

    return filteredCategories;
  }, [searchQuery]);

  // Check if any columns match the search query
  const hasSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return true;
    return Object.keys(filteredColumns).length > 0;
  }, [filteredColumns, searchQuery]);

  // Hide if there are fewer than 2 schedules
  if (schedules.length < 2) {
    return null;
  }

  const handleToggleColumn = (column: string) => {
    setSelectedColumns({
      ...selectedColumns,
      [column]: !selectedColumns[column],
    });

    // Clear preview when columns change
    setPreviewResults([]);
    setSummaryStats({
      added: 0,
      modified: 0,
      removed: 0,
      total: 0,
      unchanged: 0,
    });
  };

  const handlePreviewComparison = () => {
    if (referenceScheduleId >= 0 && comparisonScheduleId >= 0) {
      const referenceSchedule = schedules[referenceScheduleId];
      const comparisonSchedule = schedules[comparisonScheduleId];

      const columnsToCompare = Object.keys(selectedColumns).filter((column) => {
        return selectedColumns[column];
      });

      // Get comparison results
      const results = compareSchedules(
        referenceSchedule,
        comparisonSchedule,
        columnsToCompare,
      );

      // Calculate summary statistics
      const stats = {
        added: results.filter(r => {return r.status === 'added'}).length,
        modified: results.filter(r => {return r.status === 'modified'}).length,
        removed: results.filter(r => {return r.status === 'removed'}).length,
        total: results.length,
        unchanged: results.filter(r => {return r.status === 'unchanged'}).length,
      };
      setSummaryStats(stats);

      // Sort results by status priority (modified, removed, added, unchanged)
      const sortedResults = [...results].sort((a, b) => {
        const priorityA = STATUS_PRIORITY.indexOf(a.status);
        const priorityB = STATUS_PRIORITY.indexOf(b.status);
        return priorityA - priorityB;
      });

      // Display all results or limit based on showAllResults flag
      setPreviewResults(showAllResults ? sortedResults : sortedResults.slice(0, MAX_PREVIEW_RESULTS));
    }
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
    // Clear previous preview results
    setPreviewResults([]);
    setSummaryStats({
      added: 0,
      modified: 0,
      removed: 0,
      total: 0,
      unchanged: 0,
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSwapSchedules = () => {
    // Swap reference and comparison schedules
    const temp = referenceScheduleId;
    setReferenceScheduleId(comparisonScheduleId);
    setComparisonScheduleId(temp);

    // Clear preview when schedules are swapped
    setPreviewResults([]);
    setSummaryStats({
      added: 0,
      modified: 0,
      removed: 0,
      total: 0,
      unchanged: 0,
    });
  };

  const renderColumnCheckboxes = (category: string, columns: typeof COLUMN_CATEGORIES[keyof typeof COLUMN_CATEGORIES]) => {
    const count = selectedCountByCategory[category];

    return (
      <Paper className="column-category" elevation={1} key={category}>
        <Box p={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={count?.selected === count?.total}
                indeterminate={count?.selected > 0 && count?.selected < count?.total}
                onChange={() => {
                  return handleToggleCategory(category);
                }}
              />
            }
            label={
              <Typography variant="subtitle2">
                {category.replace(/_/g, " ")}
                <Typography color="textSecondary" component="span" variant="caption">
                  {` (${count?.selected}/${count?.total})`}
                </Typography>
              </Typography>
            }
          />
          <Grid container spacing={1}>
            {columns.map((column) => {
              return (
                <Grid item key={column.key} xs={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedColumns[column.key]}
                        onChange={() => {
                          return handleToggleColumn(column.key);
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
      </Paper>
    );
  };

  const renderPreviewResults = () => {
    if (previewResults.length === 0) {
      return (
        <Box p={4} textAlign="center">
          <Typography color="textSecondary" variant="body1">
            Click "Preview Comparison" to see a sample of the differences
          </Typography>
        </Box>
      );
    }

    const displayCount = showAllResults ? summaryStats.total : Math.min(previewResults.length, MAX_PREVIEW_RESULTS);

    return (
      <Box className="preview-container">
        <Box alignItems="center" display="flex" justifyContent="space-between" mb={1}>
          <Typography gutterBottom style={{ marginBottom: 0 }} variant="subtitle2">
            Preview Results (showing {displayCount} of {summaryStats.total} entries)
          </Typography>

          {summaryStats.total > DEFAULT_PREVIEW_RESULTS && (
            <Button
              color="primary"
              onClick={() => {
                setShowAllResults(!showAllResults);
                handlePreviewComparison();
              }}
              size="small"
            >
              {showAllResults ? "Show Less" : "Show All"}
            </Button>
          )}
        </Box>

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Box className="stats-container" display="flex" flexWrap="wrap">
            <Typography className="preview-stat preview-modified" variant="caption">
              Modified: {summaryStats.modified}
            </Typography>
            <Typography className="preview-stat preview-removed" variant="caption">
              Removed: {summaryStats.removed}
            </Typography>
            <Typography className="preview-stat preview-added" variant="caption">
              Added: {summaryStats.added}
            </Typography>
            <Typography className="preview-stat preview-unchanged" variant="caption">
              Unchanged: {summaryStats.unchanged}
            </Typography>
          </Box>

          {!showAllResults && previewResults.length < summaryStats.total && (
            <Typography color="textSecondary" variant="caption">
              {summaryStats.total > MAX_PREVIEW_RESULTS ? "Click 'Show All' to see all differences" : "Export to see all differences"}
            </Typography>
          )}
        </Box>

        <Paper className="preview-results" variant="outlined">
          {previewResults.map((result, index) => {
            return (
              <Box
                className={`preview-item preview-${result.status}`}
                key={index}
                mb={1}
                p={1}
              >
                <Typography variant="body2">
                  <strong>
                    {result.row.prefix} {result.row.number}-{result.row.sectionLetter} {result.row.term}
                  </strong>
                  <span className="status-badge">{result.status}</span>
                </Typography>
                {result.differences.length > 0 && (
                  <Typography className="differences" component="div" variant="caption">
                    Changes: {result.differences.join(", ")}
                  </Typography>
                )}
              </Box>
            );
          })}
        </Paper>
      </Box>
    );
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
        maxWidth="lg"
        onClose={handleClose}
        open={open}
      >
        <DialogTitle>
          <Box alignItems="center" display="flex" justifyContent="space-between">
            <Typography variant="h6">Compare Schedules</Typography>
            <Typography color="textSecondary" variant="caption">
              Select columns to compare and identify course differences
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Grid className="schedule-comparer-form" container spacing={3}>
            <Grid item md={4} xs={12}>
              <Paper className="schedule-selector-section" elevation={1}>
                <Box p={2}>
                  <Typography gutterBottom variant="subtitle2">
                    1. Select Schedules to Compare
                  </Typography>

                  <Box mb={1} mt={2} position="relative">
                    <FormControl fullWidth margin="normal">
                      <FormLabel>Reference Schedule</FormLabel>
                      <Select
                        onChange={(e) => {
                          setReferenceScheduleId(e.target.value as number);
                          // Clear preview when schedule changes
                          setPreviewResults([]);
                          setSummaryStats({
                            added: 0,
                            modified: 0,
                            removed: 0,
                            total: 0,
                            unchanged: 0,
                          });
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

                    <IconButton
                      aria-label="Swap schedules"
                      className="swap-button"
                      disabled={referenceScheduleId < 0 || comparisonScheduleId < 0}
                      onClick={handleSwapSchedules}
                      size="small"
                      title="Swap reference and comparison schedules"
                    >
                      <SyncAltIcon />
                    </IconButton>

                    <FormControl fullWidth margin="normal">
                      <FormLabel>Comparison Schedule</FormLabel>
                      <Select
                        onChange={(e) => {
                          setComparisonScheduleId(e.target.value as number);
                          // Clear preview when schedule changes
                          setPreviewResults([]);
                          setSummaryStats({
                            added: 0,
                            modified: 0,
                            removed: 0,
                            total: 0,
                            unchanged: 0,
                          });
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
                  </Box>

                  <Box mb={2} mt={3}>
                    <Typography gutterBottom variant="subtitle2">
                      3. Preview Changes
                    </Typography>
                    <Button
                      color="primary"
                      disabled={referenceScheduleId < 0 || comparisonScheduleId < 0}
                      fullWidth
                      onClick={handlePreviewComparison}
                      variant="outlined"
                    >
                      Preview Comparison
                    </Button>
                  </Box>

                  {renderPreviewResults()}
                </Box>
              </Paper>
            </Grid>

            <Grid item md={8} xs={12}>
              <Paper className="column-selector-section" elevation={1}>
                <Box p={2}>
                  <Typography gutterBottom variant="subtitle2">
                    2. Select columns to compare
                    <Tooltip title="Select columns to identify matching rows. Courses with the same values in all selected columns will be treated as the same course for comparison.">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Typography>

                  <TextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    margin="normal"
                    onChange={(e) => {
                      return setSearchQuery(e.target.value);
                    }}
                    placeholder="Search columns..."
                    size="small"
                    value={searchQuery}
                    variant="outlined"
                  />

                  <Box display="flex" mb={1} mt={2}>
                    <Button
                      color="primary"
                      onClick={() => {
                        // Select all columns
                        const updatedColumns = { ...selectedColumns };
                        Object.keys(updatedColumns).forEach(key => {
                          updatedColumns[key] = true;
                        });
                        setSelectedColumns(updatedColumns);
                      }}
                      size="small"
                      style={{ marginRight: 8 }}
                    >
                      Select All
                    </Button>
                    <Button
                      color="secondary"
                      onClick={() => {
                        // Unselect all columns
                        const updatedColumns = { ...selectedColumns };
                        Object.keys(updatedColumns).forEach(key => {
                          updatedColumns[key] = false;
                        });
                        setSelectedColumns(updatedColumns);
                      }}
                      size="small"
                      style={{ marginRight: 8 }}
                    >
                      Clear All
                    </Button>
                    <Button
                      color="secondary"
                      onClick={() => {
                        // Select essential columns only (reset to default)
                        const updatedColumns = { ...selectedColumns };
                        Object.keys(updatedColumns).forEach(key => {
                          updatedColumns[key] = false;
                        });
                        // Set defaults
                        updatedColumns.department = true;
                        updatedColumns.prefix = true;
                        updatedColumns.number = true;
                        updatedColumns.sectionLetter = true;
                        updatedColumns.instructors = true;
                        updatedColumns.term = true;
                        updatedColumns.semesterLength = true;
                        setSelectedColumns(updatedColumns);
                      }}
                      size="small"
                    >
                      Reset to Default
                    </Button>
                  </Box>

                  <Paper className="column-checkboxes-container" variant="outlined">
                    <Box maxHeight="450px" overflow="auto" p={2}>
                      <Grid container spacing={1}>
                        {/* Define the display order of categories */}
                        {['ESSENTIAL', 'TEACHING', 'SCHEDULE', 'DETAILS'].map(categoryKey => {
                          const category = categoryKey;
                          // Skip if this category doesn't exist in filtered columns when searching
                          if (searchQuery.trim() && !filteredColumns[category as keyof typeof COLUMN_CATEGORIES]) {
                            return null;
                          }

                          const columns = filteredColumns[category as keyof typeof COLUMN_CATEGORIES] || [];

                          if (columns.length === 0) return null;

                          return (
                            <React.Fragment key={category}>
                              <Grid item xs={12}>
                                <Typography style={{ marginTop: 16 }} variant="subtitle2">
                                  {category === "ESSENTIAL" ? "Course Info" :
                                   category === "TEACHING" ? "Faculty & Scheduling" :
                                   category === "SCHEDULE" ? "Meeting Details" :
                                   "Additional Information"}
                                </Typography>
                                <Divider />
                              </Grid>

                              {columns.map(column => {return (
                                <Grid item key={column.key} md={3} sm={4} xs={6}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={selectedColumns[column.key]}
                                        onChange={() => {return handleToggleColumn(column.key)}}
                                        size="small"
                                      />
                                    }
                                    label={column.label}
                                  />
                                </Grid>
                              )})}
                            </React.Fragment>
                          );
                        })}

                        {searchQuery.trim() && !hasSearchResults && (
                          <Typography align="center" color="textSecondary" style={{ marginTop: 16 }} variant="body2">
                            No columns match your search
                          </Typography>
                        )}
                      </Grid>
                    </Box>
                  </Paper>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button color="default" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={referenceScheduleId < 0 || comparisonScheduleId < 0}
            onClick={handleExportComparison}
            startIcon={<GetAppIcon />}
            variant="contained"
          >
            Export Comparison
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
