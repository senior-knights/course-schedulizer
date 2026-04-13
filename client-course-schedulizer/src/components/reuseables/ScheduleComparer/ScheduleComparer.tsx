import {
  Box,
  Button,
  Checkbox,
  Chip,
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
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import CompareIcon from "@mui/icons-material/Compare";
import SearchIcon from "@mui/icons-material/Search";
import InfoIcon from "@mui/icons-material/Info";
import GetAppIcon from "@mui/icons-material/GetApp";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import React, { useContext, useState, useMemo, useCallback } from "react";
import { AppContext } from "utilities/contexts";
import { Schedule } from "utilities/interfaces";
import { compareSchedules, exportComparisonToExcel } from "utilities/services";
import "./ScheduleComparer.scss";

// Define styles using Styled for better organization

const CompareButton = styled(Box)(({ theme }) => {
  return {
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
  };
});

const CompareIconStyled = styled(CompareIcon)(({ theme }) => {
  return {
    marginRight: theme.spacing(0.5),
  };
});

const CompareLabel = styled(Typography)({
  alignItems: 'center',
  display: 'flex',
  fontSize: '14px',
  fontWeight: 500,
  marginLeft: '8px',
  whiteSpace: 'nowrap',
}); 

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
  const [statusFilters, setStatusFilters] = useState<{
    [key in ResultStatus]: boolean;
  }>({
    added: true,
    modified: true,
    removed: true,
    unchanged: true,
  });
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

    // Clear preview when columns change
    setPreviewResults([]);
    setSummaryStats({
      added: 0,
      modified: 0,
      removed: 0,
      total: 0,
      unchanged: 0,
    });
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

  // Handle toggling a column selection
  const handleToggleColumn = useCallback((column: string) => {
    setSelectedColumns(prevColumns => {
      const newColumns = {
        ...prevColumns,
        [column]: !prevColumns[column],
      };
      return newColumns;
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
  }, []);

  // Handle toggling a status filter
  const handleToggleStatusFilter = useCallback((status: ResultStatus) => {
    setStatusFilters(prevFilters => {
      return {
        ...prevFilters,
        [status]: !prevFilters[status],
      };
    });
  }, []);

  // Hide if there are fewer than 2 schedules
  if (schedules.length < 2) {
    return null;
  }

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

      // Always save the full set of results
      setPreviewResults(sortedResults);
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
                <Grid key={column.key} size={{xs: 6}}>
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

    // Filter results based on status filters
    const filteredResults = previewResults.filter((result) => { return statusFilters[result.status]; });

    // Always show all filtered results
    const displayedResults = filteredResults;
    const totalResults = filteredResults.length;

    return (
      <Box className="preview-container">
        <Box mb={2}>
          <Tabs
            indicatorColor="primary"
            onChange={handleTabChange}
            textColor="primary"
            value={activeTab}
            variant="scrollable"
          >
            <Tab label="Changes List" />
            <Tab label="Summary" />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <>
            <Box alignItems="center" display="flex" mb={1}>
              <Typography gutterBottom style={{ marginBottom: 0 }} variant="subtitle2">
                Preview Results ({totalResults} entries)
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography gutterBottom variant="subtitle2">
                Filter by Status:
              </Typography>
              <Box display="flex" flexWrap="wrap">
                <Chip
                  clickable
                  color={statusFilters.modified ? "primary" : "default"}
                  label={`Modified (${summaryStats.modified})`}
                  onClick={() => { handleToggleStatusFilter('modified'); }}
                  style={{
                    backgroundColor: statusFilters.modified ? '#ff9800' : undefined,
                    color: statusFilters.modified ? 'white' : undefined,
                    margin: '0 8px 8px 0',
                  }}
                />
                <Chip
                  clickable
                  color={statusFilters.removed ? "primary" : "default"}
                  label={`Removed (${summaryStats.removed})`}
                  onClick={() => { handleToggleStatusFilter('removed'); }}
                  style={{
                    backgroundColor: statusFilters.removed ? '#f44336' : undefined,
                    color: statusFilters.removed ? 'white' : undefined,
                    margin: '0 8px 8px 0',
                  }}
                />
                <Chip
                  clickable
                  color={statusFilters.added ? "primary" : "default"}
                  label={`Added (${summaryStats.added})`}
                  onClick={() => { handleToggleStatusFilter('added'); }}
                  style={{
                    backgroundColor: statusFilters.added ? '#4caf50' : undefined,
                    color: statusFilters.added ? 'white' : undefined,
                    margin: '0 8px 8px 0',
                  }}
                />
                <Chip
                  clickable
                  color={statusFilters.unchanged ? "primary" : "default"}
                  label={`Unchanged (${summaryStats.unchanged})`}
                  onClick={() => { handleToggleStatusFilter('unchanged'); }}
                  style={{
                    backgroundColor: statusFilters.unchanged ? '#2196f3' : undefined,
                    color: statusFilters.unchanged ? 'white' : undefined,
                    margin: '0 8px 8px 0',
                  }}
                />
              </Box>
            </Box>

            {filteredResults.length === 0 ? (
              <Box p={3} textAlign="center">
                <Typography color="textSecondary" variant="body2">
                  No results match your current filters. Try adjusting the filters above.
                </Typography>
              </Box>
            ) : (
              <Paper className="preview-results" variant="outlined">
                <List disablePadding>
                  {displayedResults.map((result, index) => {
                    return (
                      <ListItem
                        className={`preview-item preview-${result.status}`}
                        divider={index < displayedResults.length - 1}
                        key={index}
                      >
                        <ListItemText
                          primary={
                            <Box alignItems="center" display="flex" justifyContent="space-between">
                              <Typography variant="body2">
                                <strong>
                                  {result.row.prefix} {result.row.number}-{result.row.sectionLetter} {result.row.term}
                                </strong>
                              </Typography>
                              <Chip
                                className={`status-chip status-${result.status}`}
                                label={result.status}
                                size="small"
                              />
                            </Box>
                          }
                          secondary={
                            result.differences.length > 0 ? (
                              <Typography className="differences" component="div" variant="caption">
                                <strong>Changes:</strong> {result.differences.join(", ")}
                              </Typography>
                            ) : (
                              <Typography className="differences" component="div" variant="caption">
                                <em>Course is {result.status === 'unchanged' ? 'identical' : 'completely different'} between schedules</em>
                              </Typography>
                            )
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Paper>
            )}
          </>
        )}

        {activeTab === 1 && (
          <Paper className="summary-tab" variant="outlined">
            <Box p={2}>
              <Typography gutterBottom variant="subtitle2">
                Changes Summary
              </Typography>
              {summaryStats.total === 0 ? (
                <Box mt={2} textAlign="center">
                  <Typography color="textSecondary" variant="body2">
                    No comparison data available. Select columns to compare and click "Preview Comparison".
                  </Typography>
                </Box>
              ) : (
                <Box display="flex" flexDirection="column">
                  <Box className="summary-item">
                    <Typography variant="body2">
                      <strong>Total Changes:</strong> {summaryStats.total}
                    </Typography>
                  </Box>
                  <Box className="summary-item">
                    <Typography className="modified-text" variant="body2">
                      <strong>Modified Courses:</strong> {summaryStats.modified}
                    </Typography>
                  </Box>
                  <Box className="summary-item">
                    <Typography className="removed-text" variant="body2">
                      <strong>Removed Courses:</strong> {summaryStats.removed}
                    </Typography>
                  </Box>
                  <Box className="summary-item">
                    <Typography className="added-text" variant="body2">
                      <strong>Added Courses:</strong> {summaryStats.added}
                    </Typography>
                  </Box>
                  <Box className="summary-item">
                    <Typography className="unchanged-text" variant="body2">
                      <strong>Unchanged Courses:</strong> {summaryStats.unchanged}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        )}
      </Box>
    );
  };

  return (
    <>
      <Tooltip title="Compare Schedules">
        <IconButton onClick={handleOpen}>
          <CompareIcon />
          <CompareLabel variant="button">
            COMPARE&nbsp;SCHEDULES
          </CompareLabel>
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
            <Grid size={{md: 4, xs: 12}}>
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

            <Grid size={{md: 8, xs: 12}}>
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
                        // Automatically update preview
                        setTimeout(handlePreviewComparison, 0);
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
                        // Automatically update preview
                        setTimeout(handlePreviewComparison, 0);
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
                        // Automatically update preview
                        setTimeout(handlePreviewComparison, 0);
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
                              <Grid size={{xs: 12}}>
                                <Box mb={1} mt={2}>
                                  <Typography
                                    color="primary"
                                    gutterBottom
                                    style={{ fontWeight: 500 }}
                                    variant="subtitle1"
                                  >
                                    {category === "ESSENTIAL" ? "Course Info" :
                                     category === "TEACHING" ? "Faculty & Scheduling" :
                                     category === "SCHEDULE" ? "Meeting Details" :
                                     "Additional Information"}
                                  </Typography>
                                  <Divider />
                                </Box>
                              </Grid>

                              {columns.map(column => {return (
                                <Grid key={column.key} size={{md: 3, sm: 4, xs: 6}}>
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
          <Button onClick={handleClose}>
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
