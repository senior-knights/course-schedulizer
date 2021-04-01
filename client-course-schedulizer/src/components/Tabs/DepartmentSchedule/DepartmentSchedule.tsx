import { Schedule } from "components";
import React, { useContext } from "react";
import { getEvents } from "utilities";
import { AppContext } from "utilities/contexts";
import "./DepartmentSchedule.scss";

/* Creates a list of Calendars to create the Department Schedule
 */
export const DepartmentSchedule = () => {
  const {
    appState: { departments, schedule },
  } = useContext(AppContext);

  return (
    <>
      <Schedule
        calendarHeaders={departments.sort()}
        groupedEvents={getEvents(schedule, "department")}
        scheduleType="department"
      />
    </>
  );
};
