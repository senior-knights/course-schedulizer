import { Footer, Header } from "components";
import { AboutPage, HelpPage, SchedulizerPage } from "components/pages";
import fetch from "isomorphic-fetch";
import React, { useReducer, useState } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { initialAppState, reducer, useLocal } from "utilities";
import { AppContext } from "utilities/contexts";
import "./App.scss";

const readRemoteCSV = async () => {
  // eslint-disable-next-line no-restricted-globals
  const url = location.href;
  // We'll need to be more careful about this if we end up using more GET params
  const csvIndex = url.indexOf("?csv=") + 5;
  const csvUrl = url.slice(csvIndex);
  if (csvUrl !== "") {
    const csv = await fetch(csvUrl);
    const csvString: string = await csv.text();
    console.log(csvString);
  }
};

/* App with a HashRouter.
Ref: https://medium.com/@bennirus/deploying-a-create-react-app-with-routing-to-github-pages-f386b6ce84c2
*/
export const App = () => {
  const [isCSVLoading, setIsCSVLoading] = useState(false);
  const { save } = useLocal("appState");
  const [appState, appDispatch] = useReducer(reducer(save), initialAppState);
  readRemoteCSV();

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
