import { Footer, Header } from "components";
import { AboutPage, HelpPage, SchedulizerPage } from "components/pages";
import React, { useReducer, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { initialAppState, reducer } from "utilities";
import { AppContext } from "utilities/contexts";
import "./App.scss";

export const App = () => {
  const [isCSVLoading, setIsCSVLoading] = useState(false);
  const [appState, appDispatch] = useReducer(reducer, initialAppState);

  return (
    <div className="App" data-sticky-container>
      <Router>
        <Header />
        <AppContext.Provider value={{ appDispatch, appState, isCSVLoading, setIsCSVLoading }}>
          <div className="content-container">
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
          </div>
        </AppContext.Provider>
        <Footer />
      </Router>
    </div>
  );
};
