import React, { useContext, useEffect, useState } from "react";
import StickyNode from "react-stickynode";
import Stick from "react-stick";
import { Calendar } from "../../reuseables/Calendar";
import { ScheduleToolbar } from "../../Toolbar/ScheduleToolbar";
import "./FacultySchedule.scss";
import { ScheduleContext } from "../../../utilities/services/context";
import { getProfs } from "../../../utilities/services/facultySchedule";

const getArr = (): number[] => {
  const arr: number[] = [];
  for (let i = 0; i < 24; i += 1) {
    arr.push(i);
  }
  return arr;
};

/* Creates a list of Calendars to create the Faculty Schedule
  <Stick> is used to stick the Schedule Header to the Schedule
  to track horizontal scrolling.
*/
export const FacultySchedule = () => {
  const { schedule } = useContext(ScheduleContext);
  const [professors, setProfessors] = useState<string[]>([]);

  // For some reason, this causes twice as many renders.
  useEffect(() => {
    setProfessors(getProfs(schedule));
  }, [schedule]);

  return (
    <>
      <ScheduleToolbar />
      <div className="schedule-time-axis-wrapper">
        <LeftTimeAxis />
        <div className="schedule-wrapper">
          <Stick node={<StickyHeader professors={professors} />} position="top left">
            <div className="adjacent">
              {professors.map((prof) => {
                return (
                  <div key={prof} className="calendar-width hide-axis">
                    <Calendar key={prof} />
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

// Time
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

/*
  StickyHeader is used to keep the Schedule header sticky to the
  top of the view port.
*/
// TODO: Make into reusable component for future room schedule
const StickyHeader = ({ professors }: { professors: string[] }) => {
  return (
    <StickyNode top={window.innerHeight / 10}>
      <div className="adjacent schedule-header-row">
        {professors.map((prof) => {
          return (
            <div key={prof} className="calendar-width calendar-title">
              {prof}
            </div>
          );
        })}
      </div>
    </StickyNode>
  );
};
