import { Schedule } from "components";
import React, { useContext } from "react";
import { AppContext, getEvents } from "utilities";

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
