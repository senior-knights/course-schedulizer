import React, { useReducer, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.scss";
import { AboutPage, HelpPage, SchedulizerPage } from "../pages";
import { Header } from "../Header/Header";
import { reducer } from "../../utilities/services/appReducer";
import { initialAppState } from "../../utilities/interfaces/appInterfaces";
import { AppContext } from "../../utilities/services/appContext";

export const App = () => {
  const [isCSVLoading, setIsCSVLoading] = useState(false);
  const [appState, appDispatch] = useReducer(reducer, initialAppState);

  return (
    <div className="App">
      <Router>
        <Header />
        <AppContext.Provider value={{ appDispatch, appState, isCSVLoading, setIsCSVLoading }}>
          <Switch>
            <Route path="/about">
              <AboutPage />
            </Route>
            <Route path="/help">
              <HelpPage />
            </Route>
            <Route path="/">
              <SchedulizerPage />
            </Route>
          </Switch>
        </AppContext.Provider>
      </Router>
    </div>
  );
};
