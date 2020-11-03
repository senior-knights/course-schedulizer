import React from "react";
import StickyNode from "react-stickynode";
import Stick from "react-stick";
import { Calendar } from "../../reuseables/Calendar";
import { ScheduleToolbar } from "../../Toolbar/ScheduleToolbar";
import "./FacultySchedule.scss";

// TODO: remove this
const professors = [
  "Norman",
  "Adams",
  "VanderLinden",
  "Arnold",
  "Bailey",
  "Schuurman",
  "Plantinga",
];

export const FacultySchedule = () => {
  return (
    <>
      <ScheduleToolbar />
      <div className="calendars-wrapper">
        <Stick
          autoFlipVertically
          node={
            <StickyNode top={window.innerHeight * 0.1}>
              <div className="calendars-adjacent calendar-title-row">
                {professors.map((prof) => {
                  return (
                    <div key={prof} className="calendar calendar-title">
                      {prof}
                    </div>
                  );
                })}
              </div>
            </StickyNode>
          }
          position="top left"
        >
          <div className="calendars-adjacent">
            {professors.map((prof, index) => {
              return (
                <div key={prof} className={`calendar ${index !== 0 ? "hide-axis" : ""}`}>
                  <Calendar key={prof} />
                </div>
              );
            })}
          </div>
        </Stick>
      </div>
    </>
  );
};
