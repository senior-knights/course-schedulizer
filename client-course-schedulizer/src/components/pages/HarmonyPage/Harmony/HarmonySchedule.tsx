import { Schedule } from "components";
import React, { useMemo } from "react";
import { getEvents, getProfs } from "utilities";
import { HarmonyResultState, useHarmonyResultStore } from "utilities/hooks";

/** Display the resulting schedule from Harmony on a
 *   visual schedule.
 */
export const HarmonySchedule = () => {
  const schedule = useHarmonyResultStore(selector);

  const { headers, events } = useMemo(() => {
    return { events: getEvents(schedule, "faculty"), headers: getProfs(schedule) };
  }, [schedule]);

  return (
    <>
      <Schedule calendarHeaders={headers} groupedEvents={events} readonly scheduleType="harmony" />
    </>
  );
};

const selector = ({ schedule }: HarmonyResultState) => {
  return schedule;
};
