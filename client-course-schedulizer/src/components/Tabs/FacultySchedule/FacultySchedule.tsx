import { Schedule } from "components";
import React, { useContext } from "react";
import { getEvents } from "utilities";
import { AppContext } from "utilities/contexts";
import "./FacultySchedule.scss";

/* Creates a list of Calendars to create the Faculty Schedule
 */
export const FacultySchedule = () => {
  const {
    appState: { professors, schedule },
  } = useContext(AppContext);

  return (
    <>
      <Schedule
        calendarHeaders={professors.sort()}
        groupedEvents={getEvents(schedule, "faculty")}
      />
    </>
  );
};
