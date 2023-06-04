import React from "react";
import FullCalendar from "@fullcalendar/react";
import { CalendarOptions } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import timeGridPlugin from "@fullcalendar/timegrid";
import { INITIAL_DATE } from "utilities/constants";
import "./Calendar.scss";

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
  droppable: false,
  editable: false, // TODO: Change to true if we can lock section meeting times
  // Some notes on Editable. It would be awesome to drag and drop sections, few problems.
  //    We want to prevent dragging a section to a different day
  //    All 2 or 3 meetings of a section must be dragged as a single unit
  //    Simply changing editable to true here does NOT save the new start time in the calendar, must be done elsewhere
  // eventDurationEditable: false,
  // eventStartEditable: true,
  headerToolbar: false,
  height: "auto",
  initialDate: INITIAL_DATE,
  initialView: "timeGridWeek",
  nowIndicator: false,
  plugins: [interactionPlugin, timeGridPlugin],
  selectable: true,
  slotMaxTime: "22:00:00",
  slotMinTime: "6:00:00",
  weekends: false,
};
