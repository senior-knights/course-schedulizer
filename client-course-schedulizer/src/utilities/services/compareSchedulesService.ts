/* eslint-disable sort-keys-fix/sort-keys-fix */
import * as XLSX from "xlsx";
import { flatten } from "lodash";
import moment from "moment";
import { Course, Meeting, Schedule, Section } from "utilities/interfaces";

// Define a structure for the comparison result
interface ComparisonResult {
  count?: number;
  differences: string[];
  row: {
    [key: string]: any;
  };
  status: "added" | "removed" | "modified" | "unchanged";
  totalFacultyLoad?: number;
}

interface FlattenedRow {
  anticipatedSize?: number;
  comments?: string;
  courseLevel?: string;
  day10Used?: number;
  days: string;
  deliveryMode?: string;
  department: string;
  duration: string;
  facultyHours: number;
  id: string;
  instructionalMethod?: string;
  instructors: string;
  location: string;
  maxStudentHours?: number;
  number: string;
  prefix: string;
  sectionLetter: string;
  semesterLength: string;
  shortTitle?: string;
  startTime: string;
  studentHours: number;
  term: string;
  year: number;
}

/**
 * Compares two schedules and returns the differences based on the selected columns
 */
export const compareSchedules = (
  referenceSchedule: Schedule,
  comparisonSchedule: Schedule,
  columnsToCompare: string[],
): ComparisonResult[] => {
  if (!referenceSchedule || !comparisonSchedule) {
    return [];
  }

  // First, we need to flatten the schedule data for easier comparison
  const refRows = flattenSchedule(referenceSchedule);
  const compRows = flattenSchedule(comparisonSchedule);

  // Group rows by the selected columns to compare
  const refGroups = groupRowsByColumns(refRows, columnsToCompare);
  const compGroups = groupRowsByColumns(compRows, columnsToCompare);

  // Combine all keys
  const allKeys = [...new Set([...Object.keys(refGroups), ...Object.keys(compGroups)])];

  // Compare groups
  const results: ComparisonResult[] = [];

  allKeys.forEach((key) => {
    const refGroup = refGroups[key] || [];
    const compGroup = compGroups[key] || [];

    if (refGroup.length === 0) {
      // All rows in compGroup are new (added)
      compGroup.forEach((row) => {
        results.push({
          differences: ["New entry"],
          row: row,
          status: "added",
        });
      });
    } else if (compGroup.length === 0) {
      // All rows in refGroup are missing (removed)
      refGroup.forEach((row) => {
        results.push({
          differences: ["Entry removed"],
          row: row,
          status: "removed",
        });
      });
    } else {
      // Both groups have rows, compare them in detail
      // Track which reference rows have been matched
      const matchedRefRows = new Set<string>();

      // First pass: Process all rows from comparison schedule against reference
      compGroup.forEach((compRow) => {
        // Try to find an exact match
        const exactMatch = refGroup.findIndex((refRow) => {
          return (
            refRow.department === compRow.department &&
            refRow.prefix === compRow.prefix &&
            refRow.number === compRow.number &&
            refRow.sectionLetter === compRow.sectionLetter &&
            refRow.instructors === compRow.instructors &&
            refRow.term === compRow.term &&
            refRow.semesterLength === compRow.semesterLength &&
            refRow.days === compRow.days &&
            refRow.startTime === compRow.startTime &&
            refRow.duration === compRow.duration &&
            refRow.location === compRow.location &&
            refRow.facultyHours === compRow.facultyHours &&
            refRow.studentHours === compRow.studentHours &&
            refRow.maxStudentHours === compRow.maxStudentHours &&
            refRow.shortTitle === compRow.shortTitle &&
            refRow.instructionalMethod === compRow.instructionalMethod &&
            refRow.courseLevel === compRow.courseLevel &&
            refRow.deliveryMode === compRow.deliveryMode &&
            refRow.comments === compRow.comments &&
            refRow.anticipatedSize === compRow.anticipatedSize &&
            refRow.day10Used === compRow.day10Used
          );
        });

        if (exactMatch !== -1) {
          // Found exact match - unchanged row
          matchedRefRows.add(refGroup[exactMatch].id);
          results.push({
            differences: [],
            row: compRow,
            status: "unchanged",
          });
        } else {
          // No exact match - look for best match to identify modifications
          const differences = findRowDifferences(compRow, refGroup);
          if (differences.length > 0 && differences[0] !== "New entry") {
            // This is a modified row
            // Find the reference row that was matched
            const bestMatch = findBestMatch(compRow, refGroup);
            if (bestMatch) {
              matchedRefRows.add(bestMatch.id);
            }

            results.push({
              differences,
              row: compRow,
              status: "modified",
            });
          } else {
            // Truly new entry
            results.push({
              differences: ["New entry"],
              row: compRow,
              status: "added",
            });
          }
        }
      });

      // Second pass: Check for reference rows that weren't matched (removed)
      refGroup.forEach((refRow) => {
        if (!matchedRefRows.has(refRow.id)) {
          results.push({
            differences: ["Entry removed"],
            row: refRow,
            status: "removed",
          });
        }
      });

      // Add summary row with counts
      results.push({
        count: compGroup.length,
        differences: [],
        row: summarizeGroup(compGroup, key, columnsToCompare),
        status: "unchanged",
        totalFacultyLoad: compGroup.reduce((sum, row) => {
          return sum + (row.facultyHours || 0);
        }, 0),
      });
    }
  });

  return results;
};

/**
 * Flattens a schedule into an array of rows for easier comparison
 */
const flattenSchedule = (schedule: Schedule): FlattenedRow[] => {
  const rows: FlattenedRow[] = [];

  schedule.courses.forEach((course) => {
    course.sections.forEach((section) => {
      // Handle case with no meetings
      if (!section.meetings || section.meetings.length === 0) {
        rows.push({
          days: "",
          department: course.department || "",
          duration: "",
          facultyHours: section.facultyHours || 0,
          id: `${course.department}-${course.prefixes.join("/")}-${course.number}-${section.letter}`,
          instructors: Array.isArray(section.instructors) ? section.instructors.join(", ") : "",
          location: "",
          number: course.number?.toString() || "",
          prefix: Array.isArray(course.prefixes) ? course.prefixes.join("/") : "",
          sectionLetter: section.letter || "",
          semesterLength: section.semesterLength || "",
          startTime: "",
          studentHours: section.studentHours || 0,
          term: typeof section.term === 'string' ? section.term : Array.isArray(section.term) ? section.term.join("/") : "",
          year: typeof section.year === 'number' ? section.year : new Date().getFullYear(),
          // Additional fields
          maxStudentHours: section.maxStudentHours,
          shortTitle: course.name,
          instructionalMethod: section.instructionalMethod,
          courseLevel: course.courseLevel,
          deliveryMode: section.deliveryMode,
          comments: section.comments,
          anticipatedSize: section.anticipatedSize,
          day10Used: section.day10Used,
        });
      } else {
        // With meetings, create a row for each meeting
        section.meetings.forEach((meeting) => {
          rows.push({
            days: meeting.days ? meeting.days.join("") : "",
            department: course.department || "",
            duration: meeting.duration?.toString() || "",
            facultyHours: section.facultyHours || 0,
            id: `${course.department}-${course.prefixes.join("/")}-${course.number}-${section.letter}-${meeting.days?.join("")}-${meeting.startTime}`,
            instructors: Array.isArray(section.instructors) ? section.instructors.join(", ") : "",
            location: meeting.location
              ? `${meeting.location.building || ""} ${meeting.location.roomNumber || ""}`.trim()
              : "",
            number: course.number?.toString() || "",
            prefix: Array.isArray(course.prefixes) ? course.prefixes.join("/") : "",
            sectionLetter: section.letter || "",
            semesterLength: section.semesterLength || "",
            startTime: meeting.startTime || "",
            studentHours: section.studentHours || 0,
            term: typeof section.term === 'string' ? section.term : Array.isArray(section.term) ? section.term.join("/") : "",
            year: typeof section.year === 'number' ? section.year : new Date().getFullYear(),
            // Additional fields
            maxStudentHours: section.maxStudentHours,
            shortTitle: course.name,
            instructionalMethod: section.instructionalMethod,
            courseLevel: course.courseLevel,
            deliveryMode: section.deliveryMode,
            comments: section.comments,
            anticipatedSize: section.anticipatedSize,
            day10Used: section.day10Used,
          });
        });
      }
    });
  });

  return rows;
};

/**
 * Maps UI column names to FlattenedRow field names
 */
const mapColumnNames = (column: string): string => {
  const columnMappings: { [key: string]: string } = {
    department: "department",
    prefix: "prefix",
    number: "number",
    sectionLetter: "sectionLetter",
    instructors: "instructors",
    term: "term",
    semesterLength: "semesterLength",
    days: "days",
    startTime: "startTime",
    duration: "duration",
    location: "location",
    facultyHours: "facultyHours",
    studentHours: "studentHours",
  };

  return columnMappings[column] || column;
};

/**
 * Groups rows by the selected columns
 */
const groupRowsByColumns = (
  rows: FlattenedRow[],
  columnsToCompare: string[],
): { [key: string]: FlattenedRow[] } => {
  const groups: { [key: string]: FlattenedRow[] } = {};

  rows.forEach((row) => {
    // Create a key based on the selected columns
    const key = columnsToCompare
      .map((column) => {
        // Map the column name to the appropriate field in the FlattenedRow
        const fieldName = mapColumnNames(column);
        // Safely access column using type assertion
        return (row as any)[fieldName] || "";
      })
      .join("|");

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(row);
  });

  return groups;
};

/**
 * Checks if two groups of rows are equal
 */
const areGroupsEqual = (group1: FlattenedRow[], group2: FlattenedRow[]): boolean => {
  if (group1.length !== group2.length) {
    return false;
  }

  // Do a more thorough comparison of each row
  // For each row in group1, try to find an exact match in group2
  for (const row1 of group1) {
    const exactMatch = group2.some((row2) => {
      return (
        row1.department === row2.department &&
        row1.prefix === row2.prefix &&
        row1.number === row2.number &&
        row1.sectionLetter === row2.sectionLetter &&
        row1.instructors === row2.instructors &&
        row1.term === row2.term &&
        row1.semesterLength === row2.semesterLength &&
        row1.days === row2.days &&
        row1.startTime === row2.startTime &&
        row1.duration === row2.duration &&
        row1.location === row2.location &&
        row1.facultyHours === row2.facultyHours &&
        row1.studentHours === row2.studentHours &&
        row1.maxStudentHours === row2.maxStudentHours &&
        row1.shortTitle === row2.shortTitle &&
        row1.instructionalMethod === row2.instructionalMethod &&
        row1.courseLevel === row2.courseLevel &&
        row1.deliveryMode === row2.deliveryMode &&
        row1.comments === row2.comments &&
        row1.anticipatedSize === row2.anticipatedSize &&
        row1.day10Used === row2.day10Used
      );
    });

    if (!exactMatch) {
      return false;
    }
  }

  return true;
};

/**
 * Finds differences between a row and a group of rows
 */
const findRowDifferences = (row: FlattenedRow, group: FlattenedRow[]): string[] => {
  const differences: string[] = [];

  // First, try to find a match based on department, prefix, number, and section
  // These are the primary keys that identify the "same" course
  const primaryMatch = group.find((r) => {
    return (
      r.department === row.department &&
      r.prefix === row.prefix &&
      r.number === row.number &&
      r.sectionLetter === row.sectionLetter
    );
  });

  // If we found a primary match, check what fields are different
  if (primaryMatch) {
    // Format values for display, handling undefined/null values properly
    const formatValue = (val: any): string => {
      if (val === undefined || val === null) return "none";
      if (val === "") return "empty";
      return String(val);
    };

    // Helper to add difference if values are different
    const addDiffIfChanged = (field: string, label: string, ref: any, comp: any) => {
      if (ref !== comp) {
        differences.push(`${label}: ${formatValue(ref)} → ${formatValue(comp)}`);
      }
    };

    // Compare all fields that aren't part of the primary key
    addDiffIfChanged("instructors", "Instructor", primaryMatch.instructors, row.instructors);
    addDiffIfChanged("term", "Term", primaryMatch.term, row.term);
    addDiffIfChanged("semesterLength", "Semester Length", primaryMatch.semesterLength, row.semesterLength);
    addDiffIfChanged("days", "Days", primaryMatch.days, row.days);
    addDiffIfChanged("startTime", "Start time", primaryMatch.startTime, row.startTime);
    addDiffIfChanged("duration", "Duration", primaryMatch.duration, row.duration);
    addDiffIfChanged("location", "Location", primaryMatch.location, row.location);
    addDiffIfChanged("facultyHours", "Faculty hours", primaryMatch.facultyHours, row.facultyHours);
    addDiffIfChanged("studentHours", "Student hours", primaryMatch.studentHours, row.studentHours);
    addDiffIfChanged(
      "maxStudentHours",
      "Max student hours",
      primaryMatch.maxStudentHours,
      row.maxStudentHours,
    );
    addDiffIfChanged("shortTitle", "Short title", primaryMatch.shortTitle, row.shortTitle);
    addDiffIfChanged(
      "instructionalMethod",
      "Instructional method",
      primaryMatch.instructionalMethod,
      row.instructionalMethod,
    );
    addDiffIfChanged("courseLevel", "Course level", primaryMatch.courseLevel, row.courseLevel);
    addDiffIfChanged("deliveryMode", "Delivery mode", primaryMatch.deliveryMode, row.deliveryMode);
    addDiffIfChanged("comments", "Comments", primaryMatch.comments, row.comments);
    addDiffIfChanged(
      "anticipatedSize",
      "Enrollment",
      primaryMatch.anticipatedSize,
      row.anticipatedSize,
    );
    addDiffIfChanged("day10Used", "Day 10 enrollment", primaryMatch.day10Used, row.day10Used);

    // If no specific differences were found but rows aren't exactly the same,
    // add a general message
    if (differences.length === 0) {
      // This shouldn't happen often since we check all fields, but just in case
      differences.push("Modified (details unknown)");
    }
  } else {
    // Try a secondary match with less strict criteria
    const secondaryMatch = group.find((r) => {
      // Match on just department and number (partial match)
      return (
        r.department === row.department &&
        r.number === row.number
      );
    });

    if (secondaryMatch) {
      // Format values for display
      const formatValue = (val: any): string => {
        if (val === undefined || val === null) return "none";
        if (val === "") return "empty";
        return String(val);
      };

      // Start with the section identifier change
      differences.push(`Section changed: ${formatValue(secondaryMatch.sectionLetter)} → ${formatValue(row.sectionLetter)}`);

      // Add prefix change if different
      if (secondaryMatch.prefix !== row.prefix) {
        differences.push(`Prefix changed: ${formatValue(secondaryMatch.prefix)} → ${formatValue(row.prefix)}`);
      }

      // Add other key differences
      if (secondaryMatch.instructors !== row.instructors) {
        differences.push(`Instructor changed: ${formatValue(secondaryMatch.instructors)} → ${formatValue(row.instructors)}`);
      }
      if (secondaryMatch.term !== row.term) {
        differences.push(`Term changed: ${formatValue(secondaryMatch.term)} → ${formatValue(row.term)}`);
      }
    } else {
      // No match found at all, this is a completely new entry
      differences.push("New entry");
    }
  }

  return differences;
};

/**
 * Finds the best match for a row in a group
 */
const findBestMatch = (row: FlattenedRow, group: FlattenedRow[]): FlattenedRow | null => {
  // Find the first row that matches department, prefix, number, and section
  // This is our primary key for identifying the "same" course
  const primaryMatch = group.find((r) => {
    return (
      r.department === row.department &&
      r.prefix === row.prefix &&
      r.number === row.number &&
      r.sectionLetter === row.sectionLetter
    );
  });

  if (primaryMatch) {
    return primaryMatch;
  }

  // If we can't find a match by the primary key,
  // try a less strict match using department + number + section
  const secondaryMatch = group.find((r) => {
    return (
      r.department === row.department &&
      r.number === row.number &&
      r.sectionLetter === row.sectionLetter
    );
  });

  if (secondaryMatch) {
    return secondaryMatch;
  }

  // No match found
  return null;
};

/**
 * Creates a summary row for a group
 */
const summarizeGroup = (
  group: FlattenedRow[],
  key: string,
  columnsToCompare: string[],
): { [key: string]: any } => {
  // Create a summary row with the matching columns
  const summary: { [key: string]: any } = {};

  // Add the grouped columns
  columnsToCompare.forEach((column, index) => {
    // Map the column name to the internal field name
    const fieldName = mapColumnNames(column);

    // Extract the value from the key
    const values = key.split("|");
    if (index < values.length) {
      summary[fieldName] = values[index];
    }
  });

  // Add count and total faculty load
  summary.count = group.length;
  summary.totalFacultyLoad = group.reduce((sum, row) => {
    return sum + (row.facultyHours || 0);
  }, 0);

  return summary;
};

/**
 * Truncates sheet names to ensure they don't exceed Excel's 31-character limit
 */
const truncateSheetName = (sheetName: string): string => {
  const MAX_SHEET_NAME_LENGTH = 31;
  if (sheetName.length <= MAX_SHEET_NAME_LENGTH) {
    return sheetName;
  }
  return sheetName.substring(0, MAX_SHEET_NAME_LENGTH);
};

/**
 * Exports the comparison to Excel
 */
export const exportComparisonToExcel = (
  referenceSchedule: Schedule,
  comparisonSchedule: Schedule,
  columnsToCompare: string[],
): void => {
  const comparison = compareSchedules(referenceSchedule, comparisonSchedule, columnsToCompare);

  // Create workbook with style options enabled
  const wb = XLSX.utils.book_new();

  // Ensure Workbook has the necessary style properties
  if (!wb.Workbook) {
    wb.Workbook = {
      Views: [{ RTL: false }],
      WBProps: { date1904: false },
    };
  }

  // Format data for the comparison sheet using the same structure as useExportExcel
  const comparisonData = comparison.map((result) => {
    const flatRow = result.row;

    // Only include rows that aren't summary rows (with counts)
    if (result.count !== undefined) {
      return null;
    }

    return {
      // Main identification fields and other fields matching useExportExcel order
      Department: flatRow.department || "",
      AcademicYear: flatRow.year || "",
      Term: flatRow.term || "",
      TermPart: flatRow.semesterLength || "",
      Prefix: flatRow.prefix || "",
      CourseNumber: flatRow.number || "",
      Section: flatRow.sectionLetter || "",
      Faculty: flatRow.instructors || "",
      FacultyLoad: flatRow.facultyHours || "",
      MinimumCredits: flatRow.studentHours || "",
      MaximumCredits: flatRow.maxStudentHours || "",
      MeetingDays: flatRow.days || "",
      StartTime: flatRow.startTime || "",
      MeetingDuration: flatRow.duration || "",
      Classroom: flatRow.location || "",
      ShortTitle: flatRow.shortTitle || "",
      InstructionalMethod: flatRow.instructionalMethod || "",
      CourseLevel: flatRow.courseLevel || "",
      Group: "", // This field isn't in Course type, leave blank
      DeliveryMode: flatRow.deliveryMode || "",
      Comment: flatRow.comments || "",
      Enrollment: flatRow.anticipatedSize || "",
      EnrollmentDay10: flatRow.day10Used || "",
      // Status and Differences at the end
      Status: result.status || "",
      Differences: result.differences.join("; ") || "",
    };
  }).filter(Boolean);

  const headers = [
    "Department",
    "AcademicYear",
    "Term",
    "TermPart",
    "Prefix",
    "CourseNumber",
    "Section",
    "Faculty",
    "FacultyLoad",
    "MinimumCredits",
    "MaximumCredits",
    "MeetingDays",
    "StartTime",
    "MeetingDuration",
    "Classroom",
    "ShortTitle",
    "InstructionalMethod",
    "CourseLevel",
    "Group",
    "DeliveryMode",
    "Comment",
    "Enrollment",
    "EnrollmentDay10",
    "Status",
    "Differences",
  ];

  const comparisonWs = XLSX.utils.json_to_sheet(comparisonData, { header: headers });

  // Apply styling to highlight differences
  applyExcelStylingByStatus(comparisonWs, comparisonData);

  // Add sheets to workbook
  XLSX.utils.book_append_sheet(
    wb,
    comparisonWs,
    truncateSheetName("Schedule Comparison"),
  );

  // Also add the original schedules for reference
  const refScheduleName = referenceSchedule.name || "Reference Schedule";
  const compScheduleName = comparisonSchedule.name || "Comparison Schedule";

  // Add reference schedule sheet - using the same format as Schedule tab
  const refData = formatScheduleData(referenceSchedule);
  const refWs = XLSX.utils.json_to_sheet(refData, { header: Object.keys(refData[0] || {}) });
  XLSX.utils.book_append_sheet(wb, refWs, truncateSheetName(refScheduleName));

  // Add comparison schedule sheet - using the same format as Schedule tab
  const compData = formatScheduleData(comparisonSchedule);
  const compWs = XLSX.utils.json_to_sheet(compData, { header: Object.keys(compData[0] || {}) });
  XLSX.utils.book_append_sheet(wb, compWs, truncateSheetName(compScheduleName));

  // Save the file
  const fileName = `schedule_comparison_${moment().format("YYYY-MM-DD_HH-mm-ss")}.xlsx`;

  // Use write options to ensure styles are included
  const writeOptions = {
    bookType: 'xlsx' as const,
    bookSST: false,
    type: 'binary' as const,
    cellStyles: true, // Enable cell styles
  };

  XLSX.writeFile(wb, fileName, writeOptions);
};

/**
 * Formats the schedule data in the same way as useExportExcel
 */
const formatScheduleData = (schedule: Schedule): any[] => {
  const exportData: any[] = [];

  schedule.courses.forEach((course) => {
    course.sections.forEach((section) => {
      const row = {
        Department: course.department || "",
        AcademicYear: section.year || "",
        Term: section.term || "",
        TermPart: section.semesterLength || "",
        Prefix: Array.isArray(course.prefixes)
          ? course.prefixes.join(", ")
          : "",
        CourseNumber: course.number || "",
        Section: section.letter || "",
        Faculty: Array.isArray(section.instructors)
          ? section.instructors.join(", ")
          : (section.instructors || ""),
        FacultyLoad: section.facultyHours || "",
        MinimumCredits: section.studentHours || "",
        MaximumCredits: section.maxStudentHours || "",
        MeetingDays: section.meetings
          ? section.meetings
              .map((m) => {
                return m.days
                  ? m.days.map((day) => { return day.replace(/^TH$/i, "R"); }).join("")
                  : "";
              })
              .join("\n")
          : "",
        StartTime:
          section.meetings && section.meetings.length > 0
            ? section.meetings[0].startTime || ""
            : "",
        MeetingDuration:
          section.meetings && section.meetings.length > 0
            ? section.meetings[0].duration || ""
            : "",
        Classroom: section.meetings
          ? section.meetings
              .map((m) => {
                if (!m.location || !m.location.building || !m.location.roomNumber)
                  return "";
                const building = m.location.building.trim().replace(/\s+/g, " ");
                const roomNumber = m.location.roomNumber.toString().replace(/^0+/, "");
                return `${building} ${roomNumber}`;
              })
              .join(", ")
          : "",
        ShortTitle: course.name || "",
        InstructionalMethod: section.instructionalMethod || "",
        CourseLevel: course.courseLevel || "",
        DeliveryMode: section.deliveryMode || "",
        Comment: section.comments || "",
      };
      exportData.push(row);
    });
  });

  return exportData;
};

/**
 * Applies styling to the Excel worksheet based on status
 */
const applyExcelStylingByStatus = (worksheet: XLSX.WorkSheet, data: any[]): void => {
  // Validate input
  if (!worksheet || !data || data.length === 0) {
    return;
  }

  // Ensure we have column data
  const firstRow = data[0];
  if (!firstRow) {
    return;
  }

  // Initialize column settings
  if (!worksheet["!cols"]) {
    worksheet["!cols"] = [];
  }

  const columns = Object.keys(firstRow);

  // Set default column widths
  columns.forEach((_, index) => {
    if (worksheet["!cols"]) {
      worksheet["!cols"][index] = { width: 15 };
    }
  });

  // Make Differences column wider
  const diffIndex = columns.indexOf("Differences");
  if (diffIndex !== -1 && worksheet["!cols"]) {
    worksheet["!cols"][diffIndex] = { width: 40 };
  }

  // If no Status column, we can't colorize
  const statusIndex = columns.indexOf("Status");
  if (statusIndex === -1) {
    return;
  }

  // Define color styles with full ARGB color codes
  const styles = {
    added: {
      fill: {
        patternType: "solid",
        fgColor: { rgb: "FF99FF99" }, // Light green with alpha
      },
    },
    modified: {
      fill: {
        patternType: "solid",
        fgColor: { rgb: "FFFFFF99" }, // Light yellow with alpha
      },
    },
    removed: {
      fill: {
        patternType: "solid",
        fgColor: { rgb: "FFFF9999" }, // Light red with alpha
      },
    },
  };

  // Create style cache
  const stylecache: {[key: string]: number} = {};
  if (!worksheet["!sharedFormulasBase"]) {
    worksheet["!sharedFormulasBase"] = {};
  }

  // Apply styles to each row (skip header row at index 0)
  for (let rowIndex = 1; rowIndex < data.length + 1; rowIndex++) {
    const rowData = data[rowIndex - 1];

    // Skip rows without status or with "unchanged" status
    if (!rowData || !rowData.Status || rowData.Status === "unchanged") {
      continue;
    }

    // Get appropriate style based on status
    const status = rowData.Status as "added" | "removed" | "modified";
    const style = status && styles[status];

    if (!style) {
      continue;
    }

    // Apply style to each cell in the row
    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
      const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });

      // Create cell if it doesn't exist
      if (!worksheet[cellAddress]) {
        worksheet[cellAddress] = { t: 's', v: '' };
      }

      // Apply style directly to cell
      worksheet[cellAddress].s = style;
    }
  }
};
