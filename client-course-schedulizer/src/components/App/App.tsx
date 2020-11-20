import React, { useReducer, useState } from "react";
import { Header } from "../Header/Header";
import { Tabs } from "../Tabs";
import "./App.scss";
import { AppContext } from "../../utilities/services/appContext";
import { reducer } from "../../utilities/services/appReducer";
import { initialAppState } from "../../utilities/interfaces/appInterfaces";

export const App = () => {
  const [isCSVLoading, setIsCSVLoading] = useState(false);
  const [appState, appDispatch] = useReducer(reducer, initialAppState);

  return (
    <div className="App">
      <AppContext.Provider value={{ appDispatch, appState, isCSVLoading, setIsCSVLoading }}>
        <Header />
        <Tabs />
      </AppContext.Provider>
    </div>
  );
};
