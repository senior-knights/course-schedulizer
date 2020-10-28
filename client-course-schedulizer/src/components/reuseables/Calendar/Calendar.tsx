/* eslint-disable import-order-alphabetical/order */
import FullCalendar, { EventInput } from "@fullcalendar/react";

// Plugins
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import timeGridPlugin from "@fullcalendar/timegrid";

import React from "react";
import "./Calendar.scss";

// TODO: remove
const events: EventInput = [
  {
    description: "Lecture",
    // NOTE: we need to make it be the current data
    // Or make the calendar start at a certain date
    end: "2020-10-27T11:30:00",
    extendedProps: {
      department: "CS",
      professor: "VanderLinden",
    },
    start: "2020-10-27T10:30:00",
    title: "CS262",
  },
];

export const Calendar = () => {
  return (
    <>
      <FullCalendar
        allDaySlot={false}
        dayHeaderFormat={{ weekday: "long" }}
        droppable
        editable
        events={events}
        headerToolbar={false}
        height="auto"
        initialView="timeGridWeek"
        nowIndicator={false}
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        weekends={false}
      />
    </>
  );
};
