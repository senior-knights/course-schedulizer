/* eslint-disable sort-keys-fix/sort-keys-fix*/
import * as XLSX from "xlsx";
import moment from "moment";
import { Schedule } from "utilities/interfaces";

/* 
 * Truncates sheet names to ensure they don't exceed Excel's 31-character limit
 */
const truncateSheetName = (sheetName: string): string => {
  const MAX_SHEET_NAME_LENGTH = 31;
  if (sheetName.length <= MAX_SHEET_NAME_LENGTH) {
    return sheetName;
  }
  return sheetName.substring(0, MAX_SHEET_NAME_LENGTH);
};

const formatNumber = (num: number | undefined): string => {
  if (num === undefined) return "";
  return Number.isInteger(num) ? Math.floor(num).toString() : num.toFixed(1);
};

const formatTime = (time: string | undefined): string => {
  if (!time) return "";
  // Validate the time format
  if (!/^\d{1,2}:\d{2}\s?[AP]M$/i.test(time)) {
    console.warn(`Invalid time format: ${time}`);
    return "";
  }
  return moment(time, "h:mm A").format("HH:mm:00");
}; 

export const buildExportWorkbook = (schedule: Schedule): XLSX.WorkBook => {
    // First sheet: Original Schedule
    const exportData1: any[] = [];
    schedule.courses.forEach((course: any) => {
      course.sections.forEach((section: any) => {
        const row = {
          Department: course.department ?? "",
          AcademicYear: section.year ?? "",
          Term: section.term ?? "",
          TermPart: section.semesterLength ?? "",
          Prefix: Array.isArray(course.prefixes)
            ? course.prefixes.join(", ")
            : (typeof course.prefix === "string" ? course.prefix.replace(/\s+/g, "") : ""),
          CourseNumber: course.number ?? "",
          Section: section.letter ?? "",
          Faculty: Array.isArray(section.instructors)
            ? section.instructors.join(", ")
            : (section.instructors ?? ""),
          FacultyLoad: formatNumber(section.facultyHours),
          MinimumCredits: formatNumber(section.studentHours),
          MaximumCredits: formatNumber(section.maxStudentHours),
          MeetingDays: section.meetings
            ? section.meetings
                .map((m: any) => {
                  return m.days
                    ? m.days.map((day: string) => {return day.replace(/^TH$/i, "R")}).join("")
                    : "";
                })
                .join("\n")
            : "",
          StartTime:
            section.meetings && section.meetings.length > 0
              ? section.meetings
                .map((m: any) => { return formatTime(m.startTime) })
                .join("\n")
              : "",
          MeetingDuration:
            section.meetings && section.meetings.length > 0
              ? section.meetings
                .map((m: any) => { return m.duration ?? "" })
                .join("\n")
              : "",
          Classroom: section.meetings
            ? section.meetings
                .map((m: any) => {
                  if (!m.location || !m.location.building || !m.location.roomNumber)
                    return "";
                  const building = m.location.building.trim().replace(/\s+/g, " ");
                  const roomNumber = m.location.roomNumber.toString().replace(/^0+/, "");
                  return `${building} ${roomNumber}`;
                })
                .join("\n")
            : "",
          ShortTitle: course.name ?? "",
          InstructionalMethod: section.instructionalMethod ?? "",
          CourseLevel: course.courseLevel ?? "",
          Group: course.group ?? "",
          DeliveryMode: section.deliveryMode ?? "",
          Comment: section.comments ?? "",
          Enrollment: section.anticipatedSize ?? 0,
          EnrollmentDay10: section.day10Used ?? 0,
        };
        exportData1.push(row);
      });
    });

    const headers1 = [
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
    ];

    const worksheet1 = XLSX.utils.json_to_sheet(exportData1, { header: headers1 });

    // Second sheet: Registrar Schedule
    const exportData2: any[] = [];
    schedule.courses.forEach((course: any) => {
      course.sections.forEach((section: any) => {
        // Calculate MeetingTime from start time and duration for all meetings
        const meetingTime = section.meetings && section.meetings.length > 0
          ? section.meetings
              .map((m: any) => {
                const start = m.startTime;
                const duration = m.duration;
                if (start && duration) {
                  const formattedStart = formatTime(start);
                  const formattedEnd = moment(start, "h:mm A")
                    .add(Number(duration), "minutes")
                    .format("HH:mm:00");
                  return `${formattedStart} - ${formattedEnd}`;
                }
                return "";
              })
              .join("\n")
          : "";
        // Combine Term and SemesterPart to form TermAndPart
        const termAndPart = section.term
          ? section.semesterLength
            ? `${section.term}-${section.semesterLength}`
            : section.term
          : "";

        const row = {
          Term: section.term ?? "",
          Prefix: Array.isArray(course.prefixes)
            ? course.prefixes.join(", ")
            : (typeof course.prefix === "string" ? course.prefix.replace(/\s+/g, "") : ""),
          CourseNumber: course.number ?? "",
          Section: section.letter ?? "",
          StudentCredits: formatNumber(section.studentHours),
          FacultyLoad: formatNumber(section.facultyHours),
          MeetingDays: section.meetings
            ? section.meetings
                .map((m: any) => {
                  return m.days
                    ? m.days.map((day: string) => {return day.replace(/^TH$/i, "R")}).join("")
                    : "";
                })
                .join("\n")
            : "",
          MeetingTime: meetingTime,
          BuildingAndRoom: section.meetings
            ? section.meetings
                .map((m: any) => {
                  if (!m.location || !m.location.building || !m.location.roomNumber)
                    return "";
                  const building = m.location.building.trim().replace(/\s+/g, " ");
                  const roomNumber = m.location.roomNumber.toString().replace(/^0+/, "");
                  return `${building} ${roomNumber}`;
                })
                .join("\n")
            : "",
          TermPart: section.semesterLength ?? "",
          TermAndPart: termAndPart,
          Duration:
            section.meetings && section.meetings.length > 0
              ? section.meetings
                .map((m: any) => { return m.duration ?? "" })
                .join("\n")
              : "",
          ShortTitle: course.name ?? "",
          Faculty: Array.isArray(section.instructors)
            ? section.instructors.join(", ")
            : (section.instructors ?? ""),
          InstructionalMethod: section.instructionalMethod ?? "",
          DeliveryMode: section.deliveryMode ?? "",
          Comment: section.comments ?? "",
        };
        exportData2.push(row);
      });
    });

    const headers2 = [
      "Term",
      "Prefix",
      "CourseNumber",
      "Section",
      "StudentCredits",
      "FacultyLoad",
      "MeetingDays",
      "MeetingTime",
      "BuildingAndRoom",
      "TermPart",
      "TermAndPart",
      "Duration",
      "ShortTitle",
      "Faculty",
      "InstructionalMethod",
      "DeliveryMode",
      "Comment",
    ];

    const worksheet2 = XLSX.utils.json_to_sheet(exportData2, { header: headers2 });

    // Third sheet: Metadata
    const currentDate = moment().format("YYYY-MM-DD");
    const currentTime = moment().format("HH:mm:ss");

    // Retrieve metadata from localStorage
    const notes = localStorage.getItem("schedulizerNotes") || "";
    const version = localStorage.getItem("schedulizerVersion") || "1.0.0";
    const year = localStorage.getItem("schedulizerYear") || new Date().getFullYear().toString();

    const metadataData = [
      { Label: "Export Date", Value: currentDate },
      { Label: "Export Time", Value: currentTime },
      { Label: "Academic Year", Value: year },
      { Label: "Version", Value: version },
      { Label: "Notes", Value: notes },
    ];

    const worksheet3 = XLSX.utils.json_to_sheet(metadataData);

    // Adjust column widths for metadata sheet
    const metadataColWidths = [
      { wch: 15 }, // Label column
      { wch: 50 }, // Value column
    ];
    worksheet3["!cols"] = metadataColWidths;

    // Create workbook and append sheets in order
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet1, truncateSheetName("Schedule"));
    XLSX.utils.book_append_sheet(workbook, worksheet2, truncateSheetName("Registrar Schedule"));
    XLSX.utils.book_append_sheet(workbook, worksheet3, truncateSheetName("Metadata"));

    return workbook;

}