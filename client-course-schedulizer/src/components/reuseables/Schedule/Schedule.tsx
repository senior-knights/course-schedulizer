import React from "react";
import Stick from "react-stick";
import StickyNode from "react-stickynode";
import { ScheduleToolbar } from "../../Toolbar/ScheduleToolbar";
import { Calendar } from "../Calendar";
import "./Schedule.scss";

const getArr = (): number[] => {
  const arr: number[] = [];
  for (let i = 0; i < 24; i += 1) {
    arr.push(i);
  }
  return arr;
};

interface Schedule {
  calendarHeaders: string[];
}

/* Creates a list of Calendars to create a Schedule
  <Stick> is used to stick the Schedule Header to the Schedule
  to track horizontal scrolling.
*/
export const Schedule = ({ calendarHeaders }: Schedule) => {
  return (
    <>
      <ScheduleToolbar />
      <div className="schedule-time-axis-wrapper">
        <LeftTimeAxis />
        <div className="schedule-wrapper">
          <Stick node={<ScheduleHeader headers={calendarHeaders} />} position="top left">
            <div className="adjacent">
              {calendarHeaders.map((header) => {
                return (
                  <div key={header} className="calendar-width hide-axis">
                    <Calendar key={header} />
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

// Time-axis
const LeftTimeAxis = () => {
  return (
    <div className="left-time-axis">
      {getArr().map((time) => {
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
