/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { CalendarOptions, EventClickArg } from "@fullcalendar/react";
import { Popover } from "@material-ui/core";
// import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { AddSectionPopover, AsyncComponent, Calendar, ScheduleToolbar } from "components";
import { bindPopover, usePopupState } from "material-ui-popup-state/hooks";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Sticky from "sticky-js";
// import StickyNode from "react-stickynode";
// import { Sticky, StickyContainer } from "react-sticky";
import { CourseSectionMeeting } from "utilities";
import { AppContext, ScheduleContext } from "utilities/contexts";
import {
  filterEventsByTerm,
  filterHeadersWithNoEvents,
  getHoursArr,
  GroupedEvents,
} from "utilities/services";
import "./Schedule.scss";

interface ScheduleBase extends CalendarOptions {
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

  // // TODO: remove this from the component
  // const Column = ({ data, index, style }: Thing) => {
  //   const header = data[index];

  //   return (
  //     <div style={style}>
  //       <ScheduleHeader header={header} />
  //       <div className="calendar-width hide-axis">
  //         <Calendar
  //           {...calendarOptions}
  //           key={header}
  //           eventClick={handleEventClick}
  //           events={filteredEvents[header]}
  //         />
  //       </div>
  //     </div>
  //   );
  // };

  // const elementRef = useRef<HTMLDivElement>(document.createElement("div"));
  // const boundingElementRef = useRef<HTMLDivElement>(document.createElement("div"));

  // useScrollPosition(
  //   ({ prevPos, currPos }) => {
  //     console.log(currPos.x);
  //     console.log(currPos.y);
  //   },
  //   undefined,
  //   elementRef,
  //   undefined,
  //   undefined,
  //   boundingElementRef,
  // );

  return (
    <div className="cool">
      <ScheduleToolbar />
      <div className="schedule-time-axis-wrapper">
        <LeftTimeAxis {...times} />
        <div className="schedule-wrapper">
          <div className="adjacent">
            {/* <AutoSizer>
              {({ height, width }: Size): ReactNode => {
                return (
                  <FixedSizeList
                    height={height}
                    itemCount={calenderHeadersNoEmptyInTerm.length}
                    itemData={calenderHeadersNoEmptyInTerm}
                    itemSize={window.innerWidth / 4}
                    layout="horizontal"
                    width={width}
                  >
                    {Column}
                  </FixedSizeList>
                );
              }}
            </AutoSizer> */}
            {calenderHeadersNoEmptyInTerm.map((header) => {
              return (
                <div key={header} style={{ display: "flex", flexDirection: "column" }}>
                  <ScheduleHeader header={header} />
                  <div className="calendar-width hide-axis">
                    <Calendar
                      {...calendarOptions}
                      key={header}
                      eventClick={handleEventClick}
                      events={filteredEvents[header]}
                    />
                  </div>
                </div>
              );
            })}
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
    </div>
  );
};

interface Thing {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  index: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style: any;
}

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

// https://stackoverflow.com/a/57447842/9931154
// TODO: add this to the utils.
type ArrayElementType<A> = A extends readonly (infer T)[] ? T : never;

interface ScheduleHeader {
  header: ArrayElementType<ScheduleBase["calendarHeaders"]>;
  // ref: React.MutableRefObject<HTMLDivElement>;
}

const tenVH = window.innerHeight / 10;

/*
  StickyHeader is used to keep the Schedule header sticky to the
  top of the view port.
*/
// const ScheduleHeader = ({ header }: ScheduleHeader) => {
//   return (
//     <StickyNode innerZ={4} top={window.innerHeight / 6}>
//       <div className="schedule-header-row">
//         <div key={header} className="calendar-width calendar-title">
//           {header}
//         </div>
//       </div>
//     </StickyNode>
//   );
// };

const ScheduleHeader = ({ header }: ScheduleHeader) => {
  const sticky_thing = new Sticky(".cool-sticky");

  useEffect(() => {
    return () => {
      sticky_thing.destroy();
    };
  }, [sticky_thing]);

  // useEffect(() => {
  //   window.addEventListener('scroll', listenScrollEvent);

  //   return () =>
  //     window.removeEventListener('scroll', listenScrollEvent);
  // }, []);

  const refThing = useRef(document.createElement("div"));
  const [headerStyle, setHeaderStyle] = useState({});

  const thing = () => {
    const { left } = refThing.current.getBoundingClientRect();
    const shouldBeStyle = {
      left,
    };

    if (JSON.stringify(shouldBeStyle) === JSON.stringify(headerStyle)) return;

    setHeaderStyle(shouldBeStyle);
  };

  // useScrollPosition(() => {
  //   thing();
  // });

  return (
    <div
      ref={refThing}
      onClick={() => {
        console.log(refThing.current.getBoundingClientRect());
      }}
      onScroll={() => {
        sticky_thing.update();
        thing();
      }}
    >
      <div className="schedule-header-row cool-sticky" data-sticky-wrap>
        <div key={header} className="calendar-width calendar-title" style={headerStyle}>
          {header}
        </div>
      </div>
    </div>
  );
};

// const ScheduleHeader = ({ header }: ScheduleHeader) => {
//   return (
//     <StickyContainer>
//       <Sticky>
//         {({
//           style,

//           // the following are also available but unused in this example
//           // isSticky,
//           // wasSticky,
//           // distanceFromTop,
//           // distanceFromBottom,
//           // calculatedHeight,
//         }) => {
//           return (
//             <div className="schedule-header-row">
//               <div key={header} className="calendar-width calendar-title">
//                 {header}
//               </div>
//             </div>
//           );
//         }}
//       </Sticky>
//     </StickyContainer>
//   );
// };
