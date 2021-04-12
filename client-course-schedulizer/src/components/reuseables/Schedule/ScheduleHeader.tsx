import React from "react";
import StickyNode from "react-stickynode";
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
          let className = "calendar-width calendar-title";
          if (scheduleType === "department") {
            className += " department-calendar-width";
          }
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
