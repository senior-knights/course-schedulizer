/* eslint-disable sort-imports */
import FullCalendar, { EventInput } from "@fullcalendar/react";
import moment from "moment";

// Plugins
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import timeGridPlugin from "@fullcalendar/timegrid";

import React from "react";
import "./Calendar.scss";

export const initialDate = "2000-01-02";
// TODO: remove
const events: EventInput = [
  {
    description: "Lecture",
    end: `${moment(initialDate).add(1, "days").format("YYYY-MM-DD")}T11:30:00`,
    extendedProps: {
      department: "CS",
      professor: "VanderLinden",
    },
    start: `${moment(initialDate).add(1, "days").format("YYYY-MM-DD")}T10:30:00`,
    title: "CS262",
  },
];

export const Calendar = () => {
  return (
    <>
      <FullCalendar
        allDaySlot={false}
        dayHeaderFormat={{ weekday: "short" }}
        dayHeaders={false} // TODO: temp
        droppable
        editable
        events={events}
        headerToolbar={false}
        height="auto"
        initialDate={initialDate}
        initialView="timeGridWeek"
        nowIndicator={false}
        plugins={[interactionPlugin, timeGridPlugin]}
        selectable
        slotMaxTime="22:00:00"
        slotMinTime="6:00:00"
        weekends={false}
      />
    </>
  );
};
