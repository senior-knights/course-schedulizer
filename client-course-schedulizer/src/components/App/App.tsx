import { Header } from "components";
import { AboutPage, HelpPage, SchedulizerPage } from "components/pages";
import React, { useReducer, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AppContext, initialAppState, reducer } from "utilities";
import "./App.scss";

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
