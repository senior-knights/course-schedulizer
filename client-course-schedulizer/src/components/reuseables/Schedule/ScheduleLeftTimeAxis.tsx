import React from "react";
import { getHoursArr } from "utilities/services";

interface ScheduleLeftTimeAxisProps {
  slotMaxTime: string;
  slotMinTime: string;
}

/* Display the hours on the left axis of the schedule */
export const ScheduleLeftTimeAxis = ({
  slotMinTime: min,
  slotMaxTime: max,
}: ScheduleLeftTimeAxisProps) => {
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
