// This is a test file for the export file functionality of the course schedulizer application to ensure that the export file and import file are consistent in their structure.
import { readFileSync } from "fs";
import { join } from "path";
import { csvStringToSchedule } from "utilities";
import { Schedule } from "utilities/interfaces";

describe("Checks if a schedule can be imported", () => {
	it("reads the CSV and returns a Schedule with courses", () => {
		const csvString = readFileSync(
			join(__dirname, "..", "..", "csv", "full_schedule_2025.csv"),
			"utf8",
		);
		const schedule = csvStringToSchedule(csvString);
		expect(schedule).toBeDefined();
		expect(schedule.courses.length).toBeGreaterThan(0);
	});
});

describe("Stores the internal structure of the imported schedule", () => {
    let schedule: Schedule; // Replace 'Schedule' with your actual type
  
    beforeAll(() => {
        const csvString = readFileSync(
        join(__dirname, "..", "..", "csv", "full_schedule_2025.csv"),
        "utf8",
        );
        schedule = csvStringToSchedule(csvString);
    });
    
    it("should read the csv file successfully", () => {
        expect(schedule).toBeDefined();
    });
    
    it("stores the course structure", () => {
        const courses = schedule.courses;

        const structure = courses.map((course) => ({
            department: course.department ?? "",
            prefixes: Array.isArray(course.prefixes) ? course.prefixes : [],
            number: course.number ?? "",
            name: course.name ?? "",
            courseLevel: course.courseLevel ?? "",
            group: course.group ?? "",
            importRank: course.importRank ?? 0,
            sections: (Array.isArray(course.sections) ? course.sections : []).map((section) => ({
                year: section.year ?? "",
                term: section.term ?? "",
                semesterLength: section.semesterLength ?? "",
                letter: section.letter ?? "",
                instructors: Array.isArray(section.instructors) ? section.instructors : [],
                facultyHours: section.facultyHours ?? null,
                studentHours: section.studentHours ?? null,
                maxStudentHours: section.maxStudentHours ?? null,
                deliveryMode: section.deliveryMode ?? "",
                instructionalMethod: section.instructionalMethod ?? "",
                comments: section.comments ?? "",
                anticipatedSize: section.anticipatedSize ?? null,
                day10Used: section.day10Used ?? null,
                meetings: (Array.isArray(section.meetings) ? section.meetings : section.meetings ? [section.meetings] : []).map((m) => ({
                    days: Array.isArray(m.days) ? m.days : m.days ? [m.days] : [],
                    startTime: m.startTime ?? "",
                    duration: m.duration ?? null,
                    location: {
                        building: m.location?.building ?? "",
                        roomNumber: m.location?.roomNumber ?? "",
                    },
                })),
            })),
        }));

        // Save the structure for manual inspection / regression via snapshot
        expect(structure).toMatchSnapshot();
    });
});

