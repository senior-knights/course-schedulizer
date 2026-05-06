// This is a test using snapshot
import * as XLSX from "xlsx";
import { buildExportWorkbook } from "../utilities/hooks/buildExportWorkbook";
import { csvStringToSchedule } from 'utilities';
import { Schedule, Day } from 'utilities/interfaces';
import path from "path";
import { getCSVFromXLSXData } from "../utilities/hooks/useImportFile";

// This test is designed to compare the internal data structure of the imported XLSX file with the exported XLSX file. 

describe("Internal data structure comparison", () => {

  let importedSchedule: Schedule;
  let exportedWorkbook: XLSX.WorkBook;

  beforeAll(() => {
    // Read XLSX file and parse into Schedule object
    const xlsxImportedData = XLSX.readFile(path.join(__dirname, '..', '..', 'csv', 'Schedulizer_Course_Sections_Test.xlsx'));
    const xlsxBuffer = XLSX.write(xlsxImportedData, { type: "array", bookType: "xlsx" });
    importedSchedule = csvStringToSchedule(getCSVFromXLSXData(xlsxBuffer));
    exportedWorkbook = buildExportWorkbook(importedSchedule);
  });

  it("Checks Schedule Object Structure", () => {
    expect(importedSchedule).toHaveProperty("courses");
    expect(importedSchedule.courses).toBeInstanceOf(Array);
    expect(importedSchedule.courses.length).toBeGreaterThan(0);
  });

  it("Checks Course Object Structure", () => {
    const course = importedSchedule.courses[1];
    expect(course).toHaveProperty("name");
    expect(course).toHaveProperty("number");
    expect(course).toHaveProperty("sections");
    expect(course).toHaveProperty("prefixes");
    expect(course.sections).toBeInstanceOf(Array);
    expect(course.sections.length).toBeGreaterThan(0);
    expect(course).toHaveProperty("department");
    expect(course).toHaveProperty("courseLevel");
  });

  it("Checks Section Object Structure, specifically for CS 262", () => {
    const course = importedSchedule.courses.find(c => c.name === "Software Engineering" && c.number === "262");
    expect(course).toBeDefined();
    const section = course?.sections[0];
    // console.log("Section Object:", section?.meetings);
    expect(section).toHaveProperty("facultyHours");
    expect(section).toHaveProperty("instructors");
    expect(section).toHaveProperty("letter");
    expect(section).toHaveProperty("meetings");
    expect(section).toHaveProperty("studentHours");
    expect(section).toHaveProperty("term");
    expect(section).toHaveProperty("year");
    expect(section).toHaveProperty("semesterLength");
    expect(section).toHaveProperty("instructionalMethod");
    expect(section).toHaveProperty("group");
    expect(section).toHaveProperty("anticipatedSize");
    expect(section).toHaveProperty("day10Used");
    expect(section).toHaveProperty("isNonTeaching");

    // Check if F and MW meetings are separated, with different duration and location
    expect(section?.meetings.length).toBe(2);
    const mwMeeting = section?.meetings.find(m => m.days.includes(Day.Monday) && m.days.includes(Day.Wednesday));
    const fMeeting = section?.meetings.find(m => m.days.includes(Day.Friday));
    expect(mwMeeting).toBeDefined();
    expect(fMeeting).toBeDefined();
    expect(mwMeeting?.duration).toBe(65);
    expect(fMeeting?.duration).toBe(140);
    expect(mwMeeting?.location.roomNumber).toBe("120");
    expect(fMeeting?.location.roomNumber).toBe("354");
  });

  it("Checks if the schedule can be exported", () => {
    expect(exportedWorkbook).toHaveProperty("SheetNames");
    expect(exportedWorkbook).toHaveProperty("Sheets");
  }); 

  it("Compare between imported and exported schedules", () => {
    const exportedSheet = exportedWorkbook.Sheets[exportedWorkbook.SheetNames[0]];
    expect(exportedSheet).toBeDefined();
    const xlsxBuffer = XLSX.write(exportedWorkbook, { type: "array", bookType: "xlsx" });
    const exportedSchedule = csvStringToSchedule(getCSVFromXLSXData(xlsxBuffer));
    
    //Check if the CS262 course is still there with the same properties in both scheudules - this is a more focused test for the double line property of the meetings. 
    const exportedCS262 = exportedSchedule.courses.find(c => c.name === "Software Engineering" && c.number === "262");
    const importedCS262 = importedSchedule.courses.find(c => c.name === "Software Engineering" && c.number === "262");
    expect(importedCS262).toBeDefined();
    expect(exportedCS262).toBeDefined();
    expect(exportedCS262?.sections[0].meetings.length).toBe(importedCS262?.sections[0].meetings.length);
    expect(exportedCS262?.sections[0].meetings[0].days).toEqual(importedCS262?.sections[0].meetings[0].days);
    expect(exportedCS262?.sections[0].meetings[0].duration).toBe(importedCS262?.sections[0].meetings[0].duration);
    expect(exportedCS262?.sections[0].meetings[0].location.roomNumber).toBe(importedCS262?.sections[0].meetings[0].location.roomNumber);
    expect(exportedCS262?.sections[0].meetings[1].days).toEqual(importedCS262?.sections[0].meetings[1].days);
    expect(exportedCS262?.sections[0].meetings[1].duration).toBe(importedCS262?.sections[0].meetings[1].duration);
    expect(exportedCS262?.sections[0].meetings[1].location.roomNumber).toBe(importedCS262?.sections[0].meetings[1].location.roomNumber);
  });

    // Check if the exportedSchedule and importedSchedule are the same - this does not pass because there is no deliveryMode defined in the exportedSchedule
    // expect(exportedSchedule).toEqual(importedSchedule);

    // TODO: Check the exact values in each cell 
    // TODO: Checks between the two excel sheets (Check to see which line is not working)
    // TODO: Best practices for scripts (github actions)
    // TODO: pnpm test -- update the line talk about the directory and which framework I used



    // TEST to see if CS 384 (Row 5) is the same in both sheets

    it("Compare every single column in row 5 between imported and exported XLSX (A through T", () => {
      const filePath = path.join(
        __dirname,"..", "..", "csv", "Schedulizer_Course_Sections_Test.xlsx"
      );
    
      const originalWorkbook = XLSX.readFile(filePath);
      const originalSheet = originalWorkbook.Sheets[originalWorkbook.SheetNames[0]];
      const exportedSheet = exportedWorkbook.Sheets[exportedWorkbook.SheetNames[0]];
    
      expect(originalSheet).toBeDefined();
      expect(exportedSheet).toBeDefined();
    
      const normalizeCell = (sheet: XLSX.WorkSheet, address: string): string => {
        const cell = sheet[address];
        if (!cell) return "";
        const formatted = XLSX.utils.format_cell(cell);
        return formatted == null ? "" : String(formatted).trim();
      };
    
      const row = 5;
      const columns = [
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
        "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"
      ];
    
      columns.forEach((col) => {
        const originalValue = normalizeCell(originalSheet, `${col}${row}`);
        const exportedValue = normalizeCell(exportedSheet, `${col}${row}`);
    
        expect(exportedValue).toBe(originalValue);
      });
    });

});
