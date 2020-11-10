import React, { useContext } from "react";
import "./FacultySchedule.scss";
import { Schedule } from "../../reuseables/Schedule";
import { AppContext } from "../../../utilities/services/appContext";

/* Creates a list of Calendars to create the Faculty Schedule
 */
export const FacultySchedule = () => {
  const {
    appState: { professors },
  } = useContext(AppContext);

  return (
    <>
      <Schedule calendarHeaders={professors} slotMaxTime="22:00" slotMinTime="6:00" />
    </>
  );
};
