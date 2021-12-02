import { Schedule } from "components";
import React, { useContext } from "react";
import { getEvents } from "utilities";
import { AppContext } from "utilities/contexts";

export const RoomsSchedule = () => {
  const {
    appState: { rooms, schedule },
  } = useContext(AppContext);

  return (
    <>
      <Schedule
        calendarHeaders={rooms.sort()}
        groupedEvents={getEvents(schedule, "room")}
        scheduleType="room"
      />
    </>
  );
};
