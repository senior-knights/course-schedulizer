/* eslint-disable sort-keys-fix/sort-keys-fix */
import * as XLSX from "xlsx";
import download from "js-file-download";
import moment from "moment";
import { useContext } from "react";
import { AppContext } from "utilities/contexts";

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

export const useExportExcel = () => {
  const {
    appState: { schedule },
  } = useContext(AppContext);

  const onExportExcelClick = () => {
    // Build export data from schedule
    const exportData: any[] = [];
    schedule.courses.forEach((course: any) => {
      course.sections.forEach((section: any) => {
        const row = {
          Department: course.department ?? "",
          AcademicYear: section.year ?? "",
          Term: section.term ?? "",
          TermPart: section.semesterLength ?? "",
          Prefix: Array.isArray(course.prefixes)
            ? course.prefixes.join(", ")
            : (typeof course.prefix === 'string' ? course.prefix.replace(/\s+/g, "") : ""),
          CourseNumber: course.number ?? "",
          Section: section.letter ?? "",
          Faculty: Array.isArray(section.instructors) ? section.instructors.join(", ") : (section.instructors ?? ""),
          FacultyLoad: formatNumber(section.facultyHours),
          MinimumCredits: formatNumber(section.studentHours),
          MaximumCredits: formatNumber(section.maxStudentHours),
          MeetingDays: section.meetings ? section.meetings.map((m: any) => {
            return m.days ? m.days.map((day: string) => {
              return day.replace(/^TH$/i, "R");
            }).join("") : "";
          }).join("\n") : "",
          StartTime: section.meetings && section.meetings.length > 0 ? formatTime(section.meetings[0].startTime) : "",
          MeetingDuration: section.meetings && section.meetings.length > 0 ? section.meetings[0].duration ?? "" : "",
          Classroom: section.meetings ? section.meetings.map((m: any) => {
            if (!m.location || !m.location.building || !m.location.roomNumber) return "";
            // Remove extra whitespace from building and room number
            const building = m.location.building.trim().replace(/\s+/g, " ");
            const roomNumber = m.location.roomNumber.toString().replace(/^0+/, "");

            return `${building} ${roomNumber}`;
          }).join(", ") : "",
          ShortTitle: course.name ?? "",
          InstructionalMethod: section.instructionalMethod ?? "",
          CourseLevel: course.courseLevel ?? "",
          Group: course.group ?? "",
          Comment: course.comment ?? "",
          Enrollment: section.anticipatedSize ?? 0,
          EnrollmentDay10: section.day10Used ?? 0,
        };
        exportData.push(row);
      });
    });

    // Define header order for sheet
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
      "Comment",
      "Enrollment",
      "EnrollmentDay10",
    ];

    // Create worksheet with headers in the specified order
    const worksheet = XLSX.utils.json_to_sheet(exportData, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Schedule");

    // Create a second sheet with just the export time
    const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
    const metadataData = [{ ExportTime: currentTime }];
    const metadataWorksheet = XLSX.utils.json_to_sheet(metadataData);
    XLSX.utils.book_append_sheet(workbook, metadataWorksheet, "Metadata");

    // Generate Excel buffer and trigger download
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    download(excelBuffer, `schedule_${moment().format("YYYY-MM-DD_HH-mm-ss")}.xlsx`);
  };

  return onExportExcelClick;
};
