import React from "react";
import { getHoursArr } from "utilities";

interface LeftTimeAxis {
  slotMaxTime: string;
  slotMinTime: string;
}

/* Display the hours on the left axis of the schedule
 */
export const LeftTimeAxis = ({ slotMinTime: min, slotMaxTime: max }: LeftTimeAxis) => {
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
