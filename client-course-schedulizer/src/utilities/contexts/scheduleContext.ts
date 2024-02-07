import { createContext, Dispatch, SetStateAction } from "react";
import { voidFn } from "utilities";

interface ScheduleContext {
  isScheduleLoading: boolean;
  setIsScheduleLoading:
    | Dispatch<SetStateAction<ScheduleContext["isScheduleLoading"]>>
    | (() => void);
}

/* Provide a context for each Schedule (Faculty, Room, etc.) */
// Turned off "eslint/no-redeclare"
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ScheduleContext = createContext<ScheduleContext>({
  isScheduleLoading: false,
  setIsScheduleLoading: voidFn,
});
