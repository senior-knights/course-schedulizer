import React, { useState } from "react";
import { Header } from "../Header/Header";
import { Tabs } from "../Tabs";
import "./App.scss";
import { ScheduleContext } from "../../utilities/services/context";
import { Schedule } from "../../utilities/interfaces/dataInterfaces";

export const App = () => {
  // TODO: make this a reducer
  const [schedule, setSchedule] = useState<Schedule>({ courses: [] });
  const [professors, setProfessors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="App">
      <ScheduleContext.Provider
        value={{ isLoading, professors, schedule, setIsLoading, setProfessors, setSchedule }}
      >
        <Header />
        <Tabs />
      </ScheduleContext.Provider>
    </div>
  );
};
