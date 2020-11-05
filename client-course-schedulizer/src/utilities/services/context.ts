import { createContext } from "react";
import { Schedule } from "../interfaces/dataInterfaces";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const voidFn = () => {};

interface ScheduleContext {
  schedule: Schedule;
  setSchedule: React.Dispatch<React.SetStateAction<Schedule>> | (() => void);
}

/* Used for containing the Schedule JSON object
  manipulated by the web-app.
*/
export const ScheduleContext = createContext<ScheduleContext>({
  schedule: { courses: [] },
  setSchedule: voidFn,
});
