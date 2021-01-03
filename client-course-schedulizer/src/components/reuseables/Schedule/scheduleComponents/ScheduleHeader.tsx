import React from "react";
import { ArrayElementType } from "types";
import { ScheduleBase } from "..";

interface ScheduleHeader {
  header: ArrayElementType<ScheduleBase["calendarHeaders"]>;
}

/*
  StickyHeader is used to keep the Schedule header sticky to the
  top of the view port.
*/
export const ScheduleHeader = ({ header }: ScheduleHeader) => {
  return (
    <div key={header} className="calendar-width calendar-title">
      {header}
    </div>
  );
};
