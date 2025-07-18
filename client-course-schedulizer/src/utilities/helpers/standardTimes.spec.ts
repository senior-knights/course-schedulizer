import { Day, isStandardTime, militaryTo12Hour } from "utilities";

describe("Standard Times Helper", () => {
  describe("militaryTo12Hour", () => {
    const testTimes = [
      { out: "12:15 PM", time: "12:15" },
      { out: "10:15 AM", time: "10:15" },
      { out: "2:15 PM", time: "14:15" },
    ];

    testTimes.forEach((testCase) => {
      test(`correctly converts ${testCase.time} to ${testCase.out}`, () => {
        expect(militaryTo12Hour(testCase.time)).toEqual(testCase.out);
      });
    });
  });

  describe("isStandardTime", () => {
    const testMeetings = [
      {
        meeting: {
          days: [Day.Monday, Day.Wednesday, Day.Friday],
          duration: 65,
          location: { building: "NH", roomNumber: "276" },
          startTime: "9:15 AM",
        },
        out: true,
      },
      {
        meeting: {
          days: [Day.Monday],
          duration: 65,
          location: { building: "NH", roomNumber: "276" },
          startTime: "1:30 PM",
        },
        out: true,
      },
      {
        meeting: {
          days: [Day.Friday],
          duration: 65,
          location: { building: "NH", roomNumber: "276" },
          startTime: "1:30 PM",
        },
        out: true,
      },
      {
        meeting: {
          days: [Day.Monday, Day.Wednesday, Day.Friday],
          duration: 65,
          location: { building: "NH", roomNumber: "276" },
          startTime: "1:30 PM",
        },
        out: true,
      },
      {
        meeting: {
          days: [Day.Monday, Day.Friday],
          duration: 65,
          location: { building: "NH", roomNumber: "276" },
          startTime: "1:30 PM",
        },
        out: false,
      },
      {
        meeting: {
          days: [Day.Tuesday, Day.Thursday],
          duration: 100,
          location: { building: "NH", roomNumber: "276" },
          startTime: "8:00 AM",
        },
        out: true,
      },
      {
        meeting: {
          days: [Day.Thursday],
          duration: 100,
          location: { building: "NH", roomNumber: "276" },
          startTime: "8:00 AM",
        },
        out: true,
      },
    ];

    testMeetings.forEach((testCase) => {
      test(`correctly identifies standard meeting times ${testCase.meeting.days.join("")} @ ${testCase.meeting.startTime} for ${testCase.meeting.duration} mins`, () => {
        expect(isStandardTime(testCase.meeting)).toEqual(testCase.out);
      });
    });
  });
});
