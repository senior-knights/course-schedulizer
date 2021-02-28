import { Footer, Header } from "components";
import { AboutPage, HelpPage, SchedulizerPage } from "components/pages";
import fetch from "isomorphic-fetch";
import React, { useEffect, useReducer, useState } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { csvStringToSchedule, initialAppState, reducer, useLocal } from "utilities";
import { AppContext } from "utilities/contexts";
import "./App.scss";

/* App with a HashRouter.
Ref: https://medium.com/@bennirus/deploying-a-create-react-app-with-routing-to-github-pages-f386b6ce84c2
*/
export const App = () => {
  const [isCSVLoading, setIsCSVLoading] = useState(false);
  const { save } = useLocal("appState");
  const [appState, appDispatch] = useReducer(reducer(save), initialAppState);

  // Ref: https://stackoverflow.com/questions/56663785/invalid-hook-call-hooks-can-only-be-called-inside-of-the-body-of-a-function-com
  useEffect(() => {
    // eslint-disable-next-line no-restricted-globals
    const url = location.href;
    // We'll need to be more careful about this if we end up using more GET params
    const csvIndex = url.indexOf("?csv=");
    if (csvIndex !== -1) {
      const csvUrl = url.slice(csvIndex + 5);
      if (csvUrl !== "") {
        fetch(csvUrl)
          .then((response) => {
            return response.text();
          })
          .then(async (result) => {
            const schedule = csvStringToSchedule(result);
            await appDispatch({ payload: { schedule }, type: "setScheduleData" });
          });
      }
    }
  }, []);

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
