import React, { useContext } from "react";
import { Schedule } from "../../reuseables/Schedule";
import { AppContext } from "../../../utilities/services/appContext";

export const RoomsSchedule = () => {
  const {
    appState: { rooms },
  } = useContext(AppContext);

  return (
    <>
      <Schedule calendarHeaders={rooms} slotMaxTime="22:00" slotMinTime="6:00" />
    </>
  );
};
