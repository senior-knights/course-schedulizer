import { Result } from "@harmoniously/react";
import { Day, Schedule, SemesterLength, Term } from "utilities/interfaces";
import create, { GetState, SetState, State } from "zustand";
import { persist } from "zustand/middleware";

export const useHarmonyResultStore = create<HarmonyResultState>(
  persist<HarmonyResultState>(
    (set: SetState<HarmonyResultState>, get: GetState<HarmonyResultState>) => {
      return {
        result: {},
        schedule: { courses: [] },
        setResult: (res: Result) => {
          set({ result: res, schedule: convertToSchedule(res) });
        },
      };
    },
    {
      name: "harmonyResultState",
    },
  ),
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
        facultyHours: -1,
        name: "",
        number,
        prefixes: [prefix],
        sections: [
          {
            comments: "",
            endDate: "1/1/21",
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
            term: Term.Fall,
            termStart: "01/01/21",
            year: -1,
          },
        ],
        studentHours: -1,
      });
    });
  }

  return schedule;
};
