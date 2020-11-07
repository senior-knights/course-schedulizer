import React, { useContext, useEffect, useState } from "react";
import "./FacultySchedule.scss";
import { Schedule } from "../../reuseables/Schedule";
import { getProfs } from "../../../utilities/services/facultySchedule";
import { ScheduleContext } from "../../../utilities/services/context";

/* Creates a list of Calendars to create the Faculty Schedule
 */
export const FacultySchedule = () => {
  const { schedule } = useContext(ScheduleContext);
  const [professors, setProfessors] = useState<string[]>([]);

  // For some reason, this causes twice as many renders.
  useEffect(() => {
    setProfessors(getProfs(schedule));
  }, [schedule]);

  return (
    <>
      <Schedule calendarHeaders={professors} slotMaxTime="22:00" slotMinTime="6:00" />
    </>
  );
};
