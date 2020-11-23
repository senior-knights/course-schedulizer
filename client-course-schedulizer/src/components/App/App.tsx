import React, { useReducer, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.scss";
import { AppContext } from "../../utilities/services/appContext";
import { reducer } from "../../utilities/services/appReducer";
import { initialAppState } from "../../utilities/interfaces/appInterfaces";
import { AboutPage, HelpPage, SchedulizerPage } from "../Pages";

export const App = () => {
  const [isCSVLoading, setIsCSVLoading] = useState(false);
  const [appState, appDispatch] = useReducer(reducer, initialAppState);

  return (
    <div className="App">
      <Router>
        <AppContext.Provider value={{ appDispatch, appState, isCSVLoading, setIsCSVLoading }}>
          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
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
        <nav style={{ bottom: 0, position: "sticky" }}>
          <div>
            <Link to="/">Home</Link>
          </div>
          <div>
            <Link to="/about">About</Link>
          </div>
          <div>
            <Link to="/help">Help</Link>
          </div>
        </nav>
      </Router>
    </div>
  );
};
