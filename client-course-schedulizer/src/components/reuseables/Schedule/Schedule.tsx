import { CalendarOptions } from "@fullcalendar/react";
import React, {
  useContext,
  useMemo,
  useState,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";
import Stick from "react-stick";
import StickyNode from "react-stickynode";
import { AppContext } from "../../../utilities/services/appContext";
import {
  GroupedEvents,
  getHoursArr,
  filterEventsByTerm,
  filterHeadersWithNoEvents,
} from "../../../utilities/services/schedule";

import { ScheduleToolbar } from "../../Toolbar/ScheduleToolbar";
import { AsyncComponent } from "../AsyncComponent";
import { Calendar } from "../Calendar";
import "./Schedule.scss";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const voidFn = () => {};

interface ScheduleContext {
  isScheduleLoading: boolean;
  setIsScheduleLoading:
    | Dispatch<SetStateAction<ScheduleContext["isScheduleLoading"]>>
    | (() => void);
}

export const ScheduleContext = createContext<ScheduleContext>({
  isScheduleLoading: false,
  setIsScheduleLoading: voidFn,
});

interface Schedule extends CalendarOptions {
  calendarHeaders: string[];
  groupedEvents: GroupedEvents;
}

/* Creates a list of Calendars to create a Schedule
  <Stick> is used to stick the Schedule Header to the Schedule
  to track horizontal scrolling.
*/
export const Schedule = ({ calendarHeaders, groupedEvents, ...calendarOptions }: Schedule) => {
  const [isScheduleLoading, setIsScheduleLoading] = useState(false);
  const {
    appState: { selectedTerm, slotMaxTime, slotMinTime },
  } = useContext(AppContext);

  const times = {
    slotMaxTime,
    slotMinTime,
  };

  // Add context times to the existing calendarOptions
  calendarOptions = {
    ...calendarOptions,
    ...times,
  };

  // Filter out events from other terms
  const filteredEvents = useMemo(() => {
    return filterEventsByTerm(groupedEvents, selectedTerm);
  }, [groupedEvents, selectedTerm]);

  // Filter out headers with no events
  const calenderHeadersNoEmptyInTerm = useMemo(() => {
    return filterHeadersWithNoEvents(filteredEvents, calendarHeaders);
  }, [filteredEvents, calendarHeaders]);

  return (
    <ScheduleContext.Provider value={{ isScheduleLoading, setIsScheduleLoading }}>
      <AsyncComponent isLoading={isScheduleLoading}>
        <AsyncComponent.Loading>Updating Schedule...</AsyncComponent.Loading>
        <AsyncComponent.Loaded>
          <ScheduleToolbar />
          <div className="schedule-time-axis-wrapper">
            <LeftTimeAxis {...times} />
            <div className="schedule-wrapper">
              <Stick
                node={<ScheduleHeader headers={calenderHeadersNoEmptyInTerm} />}
                position="top left"
              >
                <div className="adjacent">
                  {calenderHeadersNoEmptyInTerm.map((header) => {
                    return (
                      <div key={header} className="calendar-width hide-axis">
                        <Calendar
                          {...calendarOptions}
                          key={header}
                          events={filteredEvents[header]}
                        />
                      </div>
                    );
                  })}
                </div>
              </Stick>
            </div>
          </div>
        </AsyncComponent.Loaded>
      </AsyncComponent>
    </ScheduleContext.Provider>
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
