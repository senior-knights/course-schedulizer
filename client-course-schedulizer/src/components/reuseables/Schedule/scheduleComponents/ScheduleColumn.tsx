import { CalendarOptions, EventClickArg } from "@fullcalendar/react";
import { Calendar } from "components";
import React, { memo } from "react";
import { areEqual } from "react-window";
import { GroupedEvents } from "utilities";
import { ScheduleHeader } from ".";

interface ScheduleColumn {
  data: ScheduleColumnData;
  index: number;
  style: React.CSSProperties;
}

export interface ScheduleColumnData {
  calendarOptions: CalendarOptions;
  calenderHeadersNoEmptyInTerm: string[];
  filteredEvents: GroupedEvents;
  handleEventClick: (arg: EventClickArg) => void;
}

/* This is one column on the schedule which contains a header and
  a calendar.
  Currently, I believe this is still re-rending the column each time
  you scroll to it, but it felt faster when I called the memo(). I'm
  still not sure how memoization works properly so this can still be
  optimized better if we run into performance issues.
*/
export const ScheduleColumn = memo(({ data, index, style }: ScheduleColumn) => {
  const { calenderHeadersNoEmptyInTerm, calendarOptions, filteredEvents, handleEventClick } = data;
  const header = calenderHeadersNoEmptyInTerm[index];
  const events = filteredEvents[header];

  return (
    <div style={style}>
      <ScheduleHeader header={header} />
      <div className="calendar-width hide-axis">
        <Calendar {...calendarOptions} key={header} eventClick={handleEventClick} events={events} />
      </div>
    </div>
  );
}, areEqual);

ScheduleColumn.displayName = "Column";
