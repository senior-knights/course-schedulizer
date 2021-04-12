import React from "react";
import StickyNode from "react-stickynode";
import { getCalendarClassName } from "utilities";
import { ScheduleBaseProps } from "./ScheduleBase";

interface ScheduleHeaderProps {
  headers: ScheduleBaseProps["calendarHeaders"];
  scheduleType: ScheduleBaseProps["scheduleType"];
}

const tenVH = window.innerHeight / 10;

/*
  StickyHeader is used to keep the Schedule header sticky to the
  top of the view port.
*/
export const ScheduleHeader = ({ headers, scheduleType }: ScheduleHeaderProps) => {
  return (
    <StickyNode top={tenVH}>
      <div className="adjacent schedule-header-row">
        {headers.map((header) => {
          const className = `calendar-title ${getCalendarClassName(scheduleType)}`;
          return (
            <div key={header} className={className}>
              {header}
            </div>
          );
        })}
      </div>
    </StickyNode>
  );
};
