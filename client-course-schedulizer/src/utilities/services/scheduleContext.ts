import { createContext, Dispatch, SetStateAction } from "react";
import { voidFn } from "../helpers/utils";

interface ScheduleContext {
  isScheduleLoading: boolean;
  setIsScheduleLoading:
    | Dispatch<SetStateAction<ScheduleContext["isScheduleLoading"]>>
    | (() => void);
}

/* Provide a context for each Schedule (Faculty, Room, etc.) */
export const ScheduleContext = createContext<ScheduleContext>({
  isScheduleLoading: false,
  setIsScheduleLoading: voidFn,
});
