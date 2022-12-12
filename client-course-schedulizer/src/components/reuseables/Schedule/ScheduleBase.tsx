import { CalendarOptions, EventClickArg } from "@fullcalendar/react";
import { Popover } from "@material-ui/core";
import { AddSectionPopover, Calendar, ScheduleToolbar } from "components";
import { bindPopover, usePopupState } from "material-ui-popup-state/hooks";
import React, { useCallback, useMemo, useState } from "react";
import Stick from "react-stick";
import { CourseSectionMeeting, useAppContext } from "utilities";
// import { Tooltip } from "bootstrap";
import {
  colorConflictBorders,
  colorEventsByFeature,
  colorNonstandardTimeBorders,
  filterEventsByTerm,
  filterHeadersWithNoEvents,
  getCalendarClassName,
  GroupedEvents,
} from "utilities/services";
import { ScheduleHeader } from "./ScheduleHeader";
import { ScheduleLeftTimeAxis } from "./ScheduleLeftTimeAxis";

export interface ScheduleBaseProps extends CalendarOptions {
  calendarHeaders: string[];
  groupedEvents: GroupedEvents;
  readonly?: boolean;
  scheduleType: string;
}

/* Creates a list of Calendars to create a Schedule
  <Stick> is used to stick the Schedule Header to the Schedule
  to track horizontal scrolling.
*/
export const ScheduleBase = ({
  readonly,
  calendarHeaders,
  groupedEvents,
  scheduleType,
  ...calendarOptions
}: ScheduleBaseProps) => {
  const {
    appState: { colorBy, selectedTerm, selectedSemesterPart, slotMaxTime, slotMinTime },
  } = useAppContext();
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
    return filterEventsByTerm(groupedEvents, selectedTerm, selectedSemesterPart);
  }, [groupedEvents, selectedTerm, selectedSemesterPart]);

  // Filter out headers with no events
  const calenderHeadersNoEmptyInTerm = useMemo(() => {
    return filterHeadersWithNoEvents(filteredEvents, calendarHeaders);
  }, [filteredEvents, calendarHeaders]);

  // Color events by the selected feature
  colorEventsByFeature(filteredEvents, colorBy);
  colorConflictBorders(groupedEvents);
  colorNonstandardTimeBorders(groupedEvents);

  return (
    <>
      <ScheduleToolbar />
      <div className="schedule-time-axis-wrapper">
        <ScheduleLeftTimeAxis {...times} />
        <div className="schedule-wrapper">
          <Stick
            node={
              <ScheduleHeader headers={calenderHeadersNoEmptyInTerm} scheduleType={scheduleType} />
            }
            position="top left"
          >
            <div className="adjacent">
              {calenderHeadersNoEmptyInTerm.map((header) => {
                const className = `hide-axis ${getCalendarClassName(scheduleType)}`;
                return (
                  <div key={header} className={className}>
                    <Calendar
                      {...calendarOptions}
                      key={header}
                      eventClick={handleEventClick}
                      // eventMouseEnter = { (info) => { //TODO Have a tooltip with a conflict message without even clicking on a class
                      //   const tooltipInstance = new Tooltip(info.el, {
                      //     container: "body",
                      //     html: true,
                      //     placement: "top",
                      //     title: "test",
                      //     trigger: "focus",
                      //   });

                      //   tooltipInstance.show();}}
                      // eventMouseLeave ={toolTipInstance.hide();}
                      events={filteredEvents[header]}
                    />
                  </div>
                );
              })}
            </div>
          </Stick>
        </div>
      </div>
      <Popover
        {...bindPopover(popupState)}
        anchorOrigin={{
          horizontal: "left",
          vertical: "bottom",
        }}
        PaperProps={{ style: { maxHeight: "90%", maxWidth: "90%", minWidth: "500px" } }}
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
