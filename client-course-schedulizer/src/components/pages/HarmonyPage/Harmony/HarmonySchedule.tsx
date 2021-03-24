import { Schedule } from "components";
import React, { useMemo } from "react";
import { getEvents, getProfs } from "utilities";
import { HarmonyResultState, useHarmonyResultStore } from "utilities/hooks";

const selector = ({ schedule }: HarmonyResultState) => {
  return schedule;
};

/** Display the resulting schedule from Harmony on a
 *   visual schedule.
 */
export const HarmonySchedule = () => {
  const schedule = useHarmonyResultStore(selector);

  const headers = useMemo(() => {
    return getProfs(schedule);
  }, [schedule]);

  const events = useMemo(() => {
    return getEvents(schedule, "faculty");
  }, [schedule]);

  return (
    <>
      <Schedule calendarHeaders={headers} groupedEvents={events} />
    </>
  );
};
