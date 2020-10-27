/* eslint-disable import-order-alphabetical/order */
import FullCalendar from "@fullcalendar/react";

// Plugins
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import timeGridPlugin from "@fullcalendar/timegrid";

import React from "react";

export const Calendar = () => {
  return (
    <>
      <FullCalendar
        allDaySlot={false}
        dayHeaderFormat={{ weekday: "long" }}
        headerToolbar={false}
        initialView="timeGridWeek"
        nowIndicator={false}
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        weekends={false}
      />
    </>
  );
};
