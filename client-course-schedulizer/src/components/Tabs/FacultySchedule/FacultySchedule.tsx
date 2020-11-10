import React, { useContext } from "react";
import "./FacultySchedule.scss";
import { Schedule } from "../../reuseables/Schedule";
import { ScheduleContext } from "../../../utilities/services/context";

/* Creates a list of Calendars to create the Faculty Schedule
 */
export const FacultySchedule = () => {
  const { professors } = useContext(ScheduleContext);

  return (
    <>
      <Schedule calendarHeaders={professors} slotMaxTime="22:00" slotMinTime="6:00" />
    </>
  );
};
