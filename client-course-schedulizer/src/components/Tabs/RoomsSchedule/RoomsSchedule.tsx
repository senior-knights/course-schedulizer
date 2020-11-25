import { Schedule } from "components";
import React, { useContext } from "react";
import { getEvents } from "utilities";
import { AppContext } from "utilities/contexts";

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
