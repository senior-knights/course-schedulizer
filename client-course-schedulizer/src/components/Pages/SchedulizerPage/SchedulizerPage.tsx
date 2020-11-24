import React, { useReducer, useState } from "react";
import { initialAppState } from "../../../utilities/interfaces/appInterfaces";
import { AppContext } from "../../../utilities/services/appContext";
import { reducer } from "../../../utilities/services/appReducer";
import { Tabs } from "../../Tabs";

export const SchedulizerPage = () => {
  const [isCSVLoading, setIsCSVLoading] = useState(false);
  const [appState, appDispatch] = useReducer(reducer, initialAppState);

  return (
    <AppContext.Provider value={{ appDispatch, appState, isCSVLoading, setIsCSVLoading }}>
      <Tabs />
    </AppContext.Provider>
  );
};
