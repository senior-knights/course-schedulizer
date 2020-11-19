import React, { useContext } from "react";
import { Schedule } from "../../reuseables/Schedule";
import { AppContext } from "../../../utilities/services/appContext";
import { getEvents } from "../../../utilities/services/schedule";

export const RoomsSchedule = () => {
  const {
    appState: { schedule, rooms },
  } = useContext(AppContext);

  return (
    <>
      <Schedule calendarHeaders={rooms} groupedEvents={getEvents(schedule, "room")} />
    </>
  );
};
