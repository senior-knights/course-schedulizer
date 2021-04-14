import { Button } from "@material-ui/core";
import { Schedule } from "components";
import React, { useCallback, useMemo } from "react";
import { getEvents, getProfs } from "utilities";
import {
  HarmonyResultState,
  useAppContext,
  useHarmonyResultStore,
  useRedirect,
} from "utilities/hooks";

/** Display the resulting schedule from Harmony on a
 *   visual schedule.
 */
export const HarmonySchedule = () => {
  const schedule = useHarmonyResultStore(selector);
  const { appDispatch } = useAppContext();
  const redirectTo = useRedirect();

  const { headers, events } = useMemo(() => {
    return { events: getEvents(schedule, "faculty"), headers: getProfs(schedule) };
  }, [schedule]);

  const onClick = useCallback(() => {
    appDispatch({ payload: { schedule }, type: "setScheduleData" });
    redirectTo("/");
  }, [appDispatch, redirectTo, schedule]);

  return (
    <>
      <br />
      <Button onClick={onClick} type="button">
        Send to Schedulizer
      </Button>
      <Schedule calendarHeaders={headers} groupedEvents={events} readonly scheduleType="harmony" />
    </>
  );
};

const selector = ({ schedule }: HarmonyResultState) => {
  return schedule;
};
