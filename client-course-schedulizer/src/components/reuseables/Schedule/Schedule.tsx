import { CalendarOptions, EventClickArg } from "@fullcalendar/react";
import { Popover } from "@material-ui/core";
import { AddSectionPopover, AsyncComponent, ScheduleToolbar } from "components";
import { bindPopover, usePopupState } from "material-ui-popup-state/hooks";
import React, { ReactNode, useCallback, useContext, useMemo, useState } from "react";
import AutoSizer, { Size } from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import { CourseSectionMeeting } from "utilities";
import { AppContext, ScheduleContext } from "utilities/contexts";
import { filterEventsByTerm, filterHeadersWithNoEvents, GroupedEvents } from "utilities/services";
import "./Schedule.scss";
import { LeftTimeAxis, ScheduleColumn, ScheduleColumnData } from "./scheduleComponents";

export interface ScheduleBase extends CalendarOptions {
  calendarHeaders: string[];
  groupedEvents: GroupedEvents;
}

/* Provides a Schedule component to handle loading and async events and interfaces
  with a BaseSchedule.
*/
export const Schedule = (props: ScheduleBase) => {
  const [isScheduleLoading, setIsScheduleLoading] = useState(false);

  return (
    <ScheduleContext.Provider value={{ isScheduleLoading, setIsScheduleLoading }}>
      <AsyncComponent isLoading={isScheduleLoading}>
        <AsyncComponent.Loading>Updating Schedule...</AsyncComponent.Loading>
        <AsyncComponent.Loaded>
          <ScheduleBase {...props} />
        </AsyncComponent.Loaded>
      </AsyncComponent>
    </ScheduleContext.Provider>
  );
};

/* Creates a list of Calendars to create a Schedule
  <Stick> is used to stick the Schedule Header to the Schedule
  to track horizontal scrolling.
*/
const ScheduleBase = ({ calendarHeaders, groupedEvents, ...calendarOptions }: ScheduleBase) => {
  const {
    appState: { selectedTerm, slotMaxTime, slotMinTime },
  } = useContext(AppContext);
  const [popupData, setPopupData] = useState<CourseSectionMeeting>();

  const popupState = usePopupState({
    popupId: "addSection",
    variant: "popover",
  });

  const handleEventClick = useCallback(
    (arg: EventClickArg) => {
      setPopupData(arg.event.extendedProps as CourseSectionMeeting);
      popupState.open(arg.el);
    },
    [popupState],
  );

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

  const itemData: ScheduleColumnData = useMemo(() => {
    return {
      calendarOptions,
      calenderHeadersNoEmptyInTerm,
      filteredEvents,
      handleEventClick,
    };
  }, [calendarOptions, calenderHeadersNoEmptyInTerm, filteredEvents, handleEventClick]);

  return (
    <>
      <ScheduleToolbar />
      <div className="schedule-time-axis-wrapper">
        <LeftTimeAxis {...times} />
        <div className="schedule-wrapper">
          <div className="adjacent">
            <AutoSizer>
              {({ height, width }: Size): ReactNode => {
                return (
                  <FixedSizeList
                    height={height}
                    itemCount={calenderHeadersNoEmptyInTerm.length}
                    itemData={itemData}
                    itemSize={window.innerWidth / 4}
                    layout="horizontal"
                    overscanCount={30}
                    style={{ overflowY: "hidden" }}
                    width={width}
                  >
                    {ScheduleColumn}
                  </FixedSizeList>
                );
              }}
            </AutoSizer>
          </div>
        </div>
      </div>
      <Popover
        {...bindPopover(popupState)}
        anchorOrigin={{
          horizontal: "left",
          vertical: "bottom",
        }}
        PaperProps={{ style: { maxWidth: "50%", minWidth: "500px" } }}
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
      >
        <AddSectionPopover values={popupData} />
      </Popover>
    </>
  );
};
