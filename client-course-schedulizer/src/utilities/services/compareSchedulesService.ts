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
      r.studentHours === row.studentHours &&
      r.maxStudentHours === row.maxStudentHours &&
      r.shortTitle === row.shortTitle &&
      r.instructionalMethod === row.instructionalMethod &&
      r.courseLevel === row.courseLevel &&
      r.deliveryMode === row.deliveryMode &&
      r.comments === row.comments &&
      r.anticipatedSize === row.anticipatedSize &&
      r.day10Used === row.day10Used
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
      if (bestMatch.maxStudentHours !== row.maxStudentHours) {
        differences.push(`Max student hours changed: ${bestMatch.maxStudentHours} → ${row.maxStudentHours}`);
      }
      if (bestMatch.shortTitle !== row.shortTitle) {
        differences.push(`Short title changed: ${bestMatch.shortTitle} → ${row.shortTitle}`);
      }
      if (bestMatch.instructionalMethod !== row.instructionalMethod) {
        differences.push(`Instructional method changed: ${bestMatch.instructionalMethod} → ${row.instructionalMethod}`);
      }
      if (bestMatch.courseLevel !== row.courseLevel) {
        differences.push(`Course level changed: ${bestMatch.courseLevel} → ${row.courseLevel}`);
      }
      if (bestMatch.deliveryMode !== row.deliveryMode) {
        differences.push(`Delivery mode changed: ${bestMatch.deliveryMode} → ${row.deliveryMode}`);
      }
      if (bestMatch.comments !== row.comments) {
        differences.push(`Comments changed: ${bestMatch.comments} → ${row.comments}`);
      }
      if (bestMatch.anticipatedSize !== row.anticipatedSize) {
        differences.push(`Enrollment changed: ${bestMatch.anticipatedSize} → ${row.anticipatedSize}`);
      }
      if (bestMatch.day10Used !== row.day10Used) {
        differences.push(`Day 10 enrollment changed: ${bestMatch.day10Used} → ${row.day10Used}`);
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

  // Create workbook
  const wb = XLSX.utils.book_new();

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
  XLSX.writeFile(wb, fileName);
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
  // Initialize cell styles if they don't exist
  if (!worksheet["!cols"]) {
    worksheet["!cols"] = [];
  }

  // Set column widths
  const columns = Object.keys(data[0] || {});
  columns.forEach((_, index) => {
    if (!worksheet["!cols"]) {
      worksheet["!cols"] = [];
    }
    worksheet["!cols"][index] = { width: 15 };
  });

  // Find status column index
  const statusColumnIndex = columns.indexOf("Status");
  if (statusColumnIndex === -1) return;

  // Apply styles based on status
  data.forEach((row, rowIndex) => {
    // Skip header row
    if (rowIndex > 0) {
      // Get status value
      const status = row.Status;
      if (!status) return;

      // Convert to A1 notation for the entire row
      const rowCells = columns.map((_, colIndex) => {
        return XLSX.utils.encode_cell({ c: colIndex, r: rowIndex + 1 }); // +1 for header row
      });

      // Apply row styling based on status
      rowCells.forEach(cell => {
        if (worksheet[cell] && status) {
          let fillColor = "";

          if (status === "added") {
            fillColor = "CCFFCC"; // Light green
          } else if (status === "removed") {
            fillColor = "FFCCCC"; // Light red
          } else if (status === "modified") {
            fillColor = "FFFFCC"; // Light yellow
          }

          if (fillColor) {
            worksheet[cell].s = {
              fill: { fgColor: { rgb: fillColor } },
            };
          }
        }
      });
    }
  });
};
