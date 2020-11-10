import { createContext, Dispatch, SetStateAction } from "react";
import { Schedule } from "../interfaces/dataInterfaces";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const voidFn = () => {};

interface ScheduleContext {
  isLoading: boolean;
  professors: string[];
  schedule: Schedule;
  setIsLoading: Dispatch<SetStateAction<ScheduleContext["isLoading"]>> | (() => void);
  setProfessors: Dispatch<SetStateAction<ScheduleContext["professors"]>> | (() => void);
  setSchedule: Dispatch<SetStateAction<ScheduleContext["schedule"]>> | (() => void);
}

/* Used for containing the Schedule JSON object
  manipulated by the web-app.
*/
export const ScheduleContext = createContext<ScheduleContext>({
  isLoading: false,
  professors: [],
  schedule: { courses: [] },
  setIsLoading: voidFn,
  setProfessors: voidFn,
  setSchedule: voidFn,
});
