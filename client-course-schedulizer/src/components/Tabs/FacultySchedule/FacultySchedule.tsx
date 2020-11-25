import React, { useContext } from "react";
import "./FacultySchedule.scss";
import { Schedule } from "components";
import { AppContext, getEvents } from "utilities";

/* Creates a list of Calendars to create the Faculty Schedule
 */
export const FacultySchedule = () => {
  const {
    appState: { professors, schedule },
  } = useContext(AppContext);

  return (
    <>
      <Schedule calendarHeaders={professors} groupedEvents={getEvents(schedule, "faculty")} />
    </>
  );
};
