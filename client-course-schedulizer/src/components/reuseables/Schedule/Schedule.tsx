import { CalendarOptions } from "@fullcalendar/react";
import { filter, forOwn } from "lodash";
import React, { useContext } from "react";
import Stick from "react-stick";
import StickyNode from "react-stickynode";
import { AppContext } from "../../../utilities/services/appContext";
import { GroupedEvents, getHoursArr } from "../../../utilities/services/schedule";

import { ScheduleToolbar } from "../../Toolbar/ScheduleToolbar";
import { Calendar } from "../Calendar";
import "./Schedule.scss";

interface Schedule extends CalendarOptions {
  calendarHeaders: string[];
  groupedEvents: GroupedEvents;
}

/* Creates a list of Calendars to create a Schedule
  <Stick> is used to stick the Schedule Header to the Schedule
  to track horizontal scrolling.
*/
export const Schedule = ({ calendarHeaders, groupedEvents, ...calendarOptions }: Schedule) => {
  const {
    appState: { selectedTerm, slotMaxTime, slotMinTime },
  } = useContext(AppContext);

  const times = {
    slotMaxTime,
    slotMinTime,
  };

  calendarOptions = {
    ...calendarOptions,
    ...times,
  };

  // Filter out events from other terms
  forOwn(groupedEvents, (_, key) => {
    groupedEvents[key] = filter(groupedEvents[key], (e) => {
      return e.extendedProps?.section.term === selectedTerm;
    });
  });

  // Filter out headers with no events
  const calendarHeadersNoEmptyInTerm = filter(calendarHeaders, (header) => {
    const groupEvents = groupedEvents[header];
    return groupEvents?.length > 0;
  });

  return (
    <>
      <ScheduleToolbar />
      <div className="schedule-time-axis-wrapper">
        <LeftTimeAxis {...times} />
        <div className="schedule-wrapper">
          <Stick
            node={<ScheduleHeader headers={calendarHeadersNoEmptyInTerm} />}
            position="top left"
          >
            <div className="adjacent">
              {calendarHeadersNoEmptyInTerm.map((header) => {
                return (
                  <div key={header} className="calendar-width hide-axis">
                    <Calendar {...calendarOptions} key={header} events={groupedEvents[header]} />
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
