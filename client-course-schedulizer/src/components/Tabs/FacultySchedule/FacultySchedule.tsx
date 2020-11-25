import { Schedule } from "components";
import React, { useContext } from "react";
import { AppContext, getEvents } from "utilities";
import "./FacultySchedule.scss";

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
