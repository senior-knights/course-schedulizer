import React from "react";
import { Calendar } from "../../reuseables/Calendar";
import { ScheduleToolbar } from "../../Toolbar/ScheduleToolbar";
import "./FacultySchedule.scss";

// TODO: remove this
const professors = ["Norman", "Adams", "VanderLinden", "Arnold", "Bailey"];

export const FacultySchedule = () => {
  return (
    <>
      <ScheduleToolbar />
      <div className="calendars-wrapper">
        <div className="calendars-adjacent">
          {professors.map((prof, index) => {
            return (
              <div key={prof} className={`calendar ${index !== 0 ? "hide-axis" : ""}`}>
                <h3>{prof}</h3>
                <Calendar key={prof} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
