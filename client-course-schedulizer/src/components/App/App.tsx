import { Footer, Header } from "components";
import { AboutPage, HelpPage, SchedulizerPage } from "components/pages";
import React, { useReducer, useState } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { initialAppState, reducer, useLocal } from "utilities";
import { AppContext } from "utilities/contexts";
import "./App.scss";

/* App with a HashRouter.
Ref: https://medium.com/@bennirus/deploying-a-create-react-app-with-routing-to-github-pages-f386b6ce84c2
*/
export const App = () => {
  const [isCSVLoading, setIsCSVLoading] = useState(false);
  const { save } = useLocal("appState");
  const [appState, appDispatch] = useReducer(reducer(save), initialAppState);

  return (
    <div className="App">
      <HashRouter basename="/">
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
      </HashRouter>
    </div>
  );
};
