import React, { useState } from "react";
import { Header } from "../Header/Header";
import { Tabs } from "../Tabs";
import "./App.scss";
import { ScheduleContext } from "../../utilities/services/context";
import { Schedule } from "../../utilities/interfaces/dataInterfaces";

export const App = () => {
  const [schedule, setSchedule] = useState<Schedule>({ courses: [] });

  return (
    <div className="App">
      <ScheduleContext.Provider value={{ schedule, setSchedule }}>
        <Header />
        <Tabs />
      </ScheduleContext.Provider>
    </div>
  );
};
