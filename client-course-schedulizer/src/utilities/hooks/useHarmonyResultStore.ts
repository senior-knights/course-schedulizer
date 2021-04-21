import { Result } from "@harmoniously/react";
import { Day, Schedule, SemesterLength, Term } from "utilities/interfaces";
import create, { GetState, SetState, State } from "zustand";

export const useHarmonyResultStore = create<HarmonyResultState>(
  (set: SetState<HarmonyResultState>, get: GetState<HarmonyResultState>) => {
    return {
      result: {},
      schedule: { courses: [] },
      setResult: (res: Result) => {
        set({ result: res, schedule: convertToSchedule(res) });
      },
    };
  },
);

export interface HarmonyResultState extends State {
  result: Result;
  schedule: Schedule;
  setResult: (result: Result) => void;
}

/** Convert the assignments to a schedule object. */
const convertToSchedule = (result: Result): Schedule => {
  const schedule: Schedule = { courses: [] };
  if (result !== undefined) {
    Object.keys(result).forEach((course) => {
      // TODO update this.
      const [prefix, number, letter] = course.split("-");
      const courseObject = result[course];
      const { professor, time, room } = courseObject;
      const [building, roomNumber] = room.split(" ");

      schedule.courses.push({
        department: "",
        name: "",
        number,
        prefixes: [prefix],
        sections: [
          {
            comments: "",
            endDate: "1/1/21",
            facultyHours: -1,
            instructionalMethod: "",
            instructors: [professor],
            letter,
            meetings: [
              {
                days: [Day.Monday, Day.Wednesday, Day.Friday],
                duration: 50,
                location: { building, roomNumber },
                startTime: time,
              },
            ],
            semesterLength: SemesterLength.Full,
            startDate: "01/01/21",
            status: "",
            studentHours: -1,
            term: Term.Fall,
            termStart: "01/01/21",
            year: -1,
          },
        ],
      });
    });
  }

  return schedule;
};
