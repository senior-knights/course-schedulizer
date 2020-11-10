import { createContext, Dispatch, SetStateAction } from "react";
import { Schedule } from "../interfaces/dataInterfaces";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const voidFn = () => {};

interface ScheduleContext {
  professors: string[];
  schedule: Schedule;
  setProfessors: Dispatch<SetStateAction<string[]>> | (() => void);
  setSchedule: Dispatch<SetStateAction<Schedule>> | (() => void);
}

/* Used for containing the Schedule JSON object
  manipulated by the web-app.
*/
export const ScheduleContext = createContext<ScheduleContext>({
  professors: [],
  schedule: { courses: [] },
  setProfessors: voidFn,
  setSchedule: voidFn,
});
