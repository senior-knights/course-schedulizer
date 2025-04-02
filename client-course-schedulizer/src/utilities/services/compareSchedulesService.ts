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
  course: Course;
  days: string;
  department: string;
  duration: string;
  facultyHours: number;
  id: string;
  instructors: string;
  location: string;
  meeting?: Meeting;
  number: string;
  prefix: string;
  section: Section;
  sectionLetter: string;
  semesterLength: string;
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
      // Both groups have rows, compare them
      // If there are differences between the groups, mark as modified
      if (!areGroupsEqual(refGroup, compGroup)) {
        // Add all rows from the comparison schedule
        compGroup.forEach((row) => {
          const differences = findRowDifferences(row, refGroup);
          results.push({
            differences,
            row: row,
            status: differences.length > 0 ? "modified" : "unchanged",
          });
        });
      } else {
        // Groups are equal, mark as unchanged
        compGroup.forEach((row) => {
          results.push({
            differences: [],
            row: row,
            status: "unchanged",
          });
        });
      }

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
          course,
          days: "",
          department: course.department || "",
          duration: "",
          facultyHours: section.facultyHours || 0,
          id: `${course.department}-${course.prefixes.join("/")}-${course.number}-${section.letter}`,
          instructors: Array.isArray(section.instructors) ? section.instructors.join(", ") : "",
          location: "",
          number: course.number?.toString() || "",
          prefix: Array.isArray(course.prefixes) ? course.prefixes.join("/") : "",
          section,
          sectionLetter: section.letter || "",
          semesterLength: section.semesterLength || "",
          startTime: "",
          studentHours: section.studentHours || 0,
          term: typeof section.term === 'string' ? section.term : Array.isArray(section.term) ? section.term.join("/") : "",
          year: typeof section.year === 'number' ? section.year : new Date().getFullYear(),
        });
      } else {
        // With meetings, create a row for each meeting
        section.meetings.forEach((meeting) => {
          rows.push({
            course,
            days: meeting.days ? meeting.days.join("") : "",
            department: course.department || "",
            duration: meeting.duration?.toString() || "",
            facultyHours: section.facultyHours || 0,
            id: `${course.department}-${course.prefixes.join("/")}-${course.number}-${section.letter}-${meeting.days?.join("")}-${meeting.startTime}`,
            instructors: Array.isArray(section.instructors) ? section.instructors.join(", ") : "",
            location: meeting.location
              ? `${meeting.location.building || ""} ${meeting.location.roomNumber || ""}`.trim()
              : "",
            meeting,
            number: course.number?.toString() || "",
            prefix: Array.isArray(course.prefixes) ? course.prefixes.join("/") : "",
            section,
            sectionLetter: section.letter || "",
            semesterLength: section.semesterLength || "",
            startTime: meeting.startTime || "",
            studentHours: section.studentHours || 0,
            term: typeof section.term === 'string' ? section.term : Array.isArray(section.term) ? section.term.join("/") : "",
            year: typeof section.year === 'number' ? section.year : new Date().getFullYear(),
          });
        });
      }
    });
  });

  return rows;
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
        // Safely access column using type assertion
        return (row as any)[column] || "";
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

  // This is a simplistic approach - we're just checking if the groups have the same number of elements
  // For more detailed comparison, we'd need to check all fields of all rows
  return true;
};

/**
 * Finds differences between a row and a group of rows
 */
const findRowDifferences = (row: FlattenedRow, group: FlattenedRow[]): string[] => {
  const differences: string[] = [];

  // Check if there's an exact match for this row in the group
  const match = group.find((r) => {
    return (
      r.department === row.department &&
      r.prefix === row.prefix &&
      r.number === row.number &&
      r.sectionLetter === row.sectionLetter &&
      r.instructors === row.instructors &&
      r.term === row.term &&
      r.semesterLength === row.semesterLength &&
      r.days === row.days &&
      r.startTime === row.startTime &&
      r.duration === row.duration &&
      r.location === row.location &&
      r.facultyHours === row.facultyHours &&
      r.studentHours === row.studentHours
    );
  });

  if (!match) {
    // No exact match, find the specific differences
    const bestMatch = findBestMatch(row, group);
    if (bestMatch) {
      if (bestMatch.instructors !== row.instructors) {
        differences.push(`Instructor changed: ${bestMatch.instructors} → ${row.instructors}`);
      }
      if (bestMatch.days !== row.days) {
        differences.push(`Days changed: ${bestMatch.days} → ${row.days}`);
      }
      if (bestMatch.startTime !== row.startTime) {
        differences.push(`Start time changed: ${bestMatch.startTime} → ${row.startTime}`);
      }
      if (bestMatch.duration !== row.duration) {
        differences.push(`Duration changed: ${bestMatch.duration} → ${row.duration}`);
      }
      if (bestMatch.location !== row.location) {
        differences.push(`Location changed: ${bestMatch.location} → ${row.location}`);
      }
      if (bestMatch.facultyHours !== row.facultyHours) {
        differences.push(`Faculty hours changed: ${bestMatch.facultyHours} → ${row.facultyHours}`);
      }
      if (bestMatch.studentHours !== row.studentHours) {
        differences.push(`Student hours changed: ${bestMatch.studentHours} → ${row.studentHours}`);
      }
    } else {
      differences.push("Completely new entry");
    }
  }

  return differences;
};

/**
 * Finds the best match for a row in a group
 */
const findBestMatch = (row: FlattenedRow, group: FlattenedRow[]): FlattenedRow | null => {
  // This is a simplistic approach - we're just finding the first row that matches
  // department, prefix, number, and section
  return (
    group.find((r) => {
      return (
        r.department === row.department &&
        r.prefix === row.prefix &&
        r.number === row.number &&
        r.sectionLetter === row.sectionLetter
      );
    }) || null
  );
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
    // Extract the value from the key
    const values = key.split("|");
    if (index < values.length) {
      summary[column] = values[index];
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

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Create the comparison sheet
  const comparisonData = comparison.map((result) => {
    const row = { ...result.row };

    // Add status and differences
    row.status = result.status;
    row.differences = result.differences.join("; ");

    // Add count and faculty load if available
    if (result.count !== undefined) {
      row.count = result.count;
    }
    if (result.totalFacultyLoad !== undefined) {
      row.totalFacultyLoad = result.totalFacultyLoad;
    }

    return row;
  });

  const comparisonWs = XLSX.utils.json_to_sheet(comparisonData);

  // Apply styling to highlight differences
  applyExcelStyling(comparisonWs, comparison);

  // Add sheets to workbook
  XLSX.utils.book_append_sheet(
    wb,
    comparisonWs,
    truncateSheetName("Schedule Comparison"),
  );

  // Also add the original schedules for reference
  const refScheduleName = referenceSchedule.name || "Reference Schedule";
  const compScheduleName = comparisonSchedule.name || "Comparison Schedule";

  // Add reference schedule sheet
  const refData = flattenSchedule(referenceSchedule);
  const refWs = XLSX.utils.json_to_sheet(refData);
  XLSX.utils.book_append_sheet(wb, refWs, truncateSheetName(refScheduleName));

  // Add comparison schedule sheet
  const compData = flattenSchedule(comparisonSchedule);
  const compWs = XLSX.utils.json_to_sheet(compData);
  XLSX.utils.book_append_sheet(wb, compWs, truncateSheetName(compScheduleName));

  // Save the file
  const fileName = `schedule_comparison_${moment().format("YYYY-MM-DD_HH-mm-ss")}.xlsx`;
  XLSX.writeFile(wb, fileName);
};

/**
 * Applies styling to the Excel worksheet to highlight differences
 */
const applyExcelStyling = (worksheet: XLSX.WorkSheet, comparison: ComparisonResult[]): void => {
  // Initialize cell styles if they don't exist
  if (!worksheet["!cols"]) {
    worksheet["!cols"] = [];
  }

  // Set column widths
  const columns = Object.keys(comparison[0]?.row || {});
  columns.forEach((_, index) => {
    if (!worksheet["!cols"]) {
      worksheet["!cols"] = [];
    }
    worksheet["!cols"][index] = { width: 15 };
  });

  // Apply styles based on status
  comparison.forEach((result, rowIndex) => {
    // Skip header row (rowIndex 0)
    if (rowIndex > 0) {
      // Convert to A1 notation
      const cell = XLSX.utils.encode_cell({ c: 0, r: rowIndex + 1 }); // +1 for header row

      // Apply cell style based on status
      if (result.status === "added") {
        worksheet[cell].s = {
          fill: { fgColor: { rgb: "CCFFCC" } }, // Light green
        };
      } else if (result.status === "removed") {
        worksheet[cell].s = {
          fill: { fgColor: { rgb: "FFCCCC" } }, // Light red
        };
      } else if (result.status === "modified") {
        worksheet[cell].s = {
          fill: { fgColor: { rgb: "FFFFCC" } }, // Light yellow
        };
      }
    }
  });
};
