import { AsyncComponent, ScheduleBase, ScheduleBaseProps } from "components";
import React, { useState } from "react";
import { ScheduleContext } from "utilities/contexts";
import "./Schedule.scss";

/* Provides a Schedule component to handle loading and async events and interfaces
  with a BaseSchedule.
*/
export const Schedule = (props: ScheduleBaseProps) => {
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
