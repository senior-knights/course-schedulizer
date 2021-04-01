import React from "react";
import StickyNode from "react-stickynode";
import { ScheduleBaseProps } from "./ScheduleBase";

interface ScheduleHeaderProps {
  headers: ScheduleBaseProps["calendarHeaders"];
}

const tenVH = window.innerHeight / 10;

/*
  StickyHeader is used to keep the Schedule header sticky to the
  top of the view port.
*/
export const ScheduleHeader = ({ headers }: ScheduleHeaderProps) => {
  return (
    <StickyNode top={tenVH}>
      <div className="adjacent schedule-header-row">
        {headers.map((header) => {
          return (
            <div key={header} className="calendar-width calendar-title">
              {header}
            </div>
          );
        })}
      </div>
    </StickyNode>
  );
};
