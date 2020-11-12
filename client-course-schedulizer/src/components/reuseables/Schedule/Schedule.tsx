import { CalendarOptions } from "@fullcalendar/react";
import React from "react";
import Stick from "react-stick";
import StickyNode from "react-stickynode";
import { getHoursArr } from "../../../utilities/services/schedule";
import { ScheduleToolbar } from "../../Toolbar/ScheduleToolbar";
import { Calendar } from "../Calendar";
import "./Schedule.scss";

interface Schedule extends CalendarOptions {
  calendarHeaders: string[];
}

/* Creates a list of Calendars to create a Schedule
  <Stick> is used to stick the Schedule Header to the Schedule
  to track horizontal scrolling.
*/
export const Schedule = ({ calendarHeaders, ...calendarOptions }: Schedule) => {
  const times = {
    slotMaxTime: calendarOptions.slotMaxTime as string,
    slotMinTime: calendarOptions.slotMinTime as string,
  };
  return (
    <>
      <ScheduleToolbar />
      <div className="schedule-time-axis-wrapper">
        <LeftTimeAxis {...times} />
        <div className="schedule-wrapper">
          <Stick node={<ScheduleHeader headers={calendarHeaders} />} position="top left">
            <div className="adjacent">
              {calendarHeaders.map((header) => {
                return (
                  <div key={header} className="calendar-width hide-axis">
                    <Calendar {...calendarOptions} key={header} />
                  </div>
                );
              })}
            </div>
          </Stick>
        </div>
      </div>
    </>
  );
};

interface LeftTimeAxis {
  slotMaxTime: string;
  slotMinTime: string;
}

/* Display the hours on the left axis of the schedule
 */
const LeftTimeAxis = ({ slotMinTime: min, slotMaxTime: max }: LeftTimeAxis) => {
  return (
    <div className="left-time-axis">
      {getHoursArr(min, max).map((time) => {
        return (
          <div key={time} className="time-slot">
            <span>{`${time}:00`}</span>
          </div>
        );
      })}
    </div>
  );
};

interface ScheduleHeader {
  headers: Schedule["calendarHeaders"];
}

const tenVH = window.innerHeight / 10;

/*
  StickyHeader is used to keep the Schedule header sticky to the
  top of the view port.
*/
const ScheduleHeader = ({ headers }: ScheduleHeader) => {
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
