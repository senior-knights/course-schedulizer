/* eslint-disable sort-imports */
import FullCalendar from "@fullcalendar/react";
import { CalendarOptions } from "@fullcalendar/common";

// Plugins
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import timeGridPlugin from "@fullcalendar/timegrid";

import React from "react";
import "./Calendar.scss";

export const initialDate = "2000-01-02";

export const Calendar = (props: CalendarOptions) => {
  return (
    <>
      <FullCalendar {...props} />
    </>
  );
};

Calendar.defaultProps = {
  allDaySlot: false,
  dayHeaderFormat: { weekday: "short" },
  droppable: true,
  editable: false, // TODO: Change to true if we can leek section meeting times
  headerToolbar: false,
  height: "auto",
  initialDate,
  initialView: "timeGridWeek",
  nowIndicator: false,
  plugins: [interactionPlugin, timeGridPlugin],
  selectable: true,
  slotMaxTime: "22:00:00",
  slotMinTime: "6:00:00",
  weekends: false,
};
