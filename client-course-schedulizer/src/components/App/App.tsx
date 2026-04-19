import { Footer, Header } from "components";
import { AboutPage, CompareResultsPage, CompareSettingsPage, HelpPage, SchedulizerPage } from "components/pages";
import React, { useReducer, useState } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { reducer } from "utilities";
import { useLocal } from "utilities/hooks/useLocal";
import { AppContext } from "utilities/contexts";
import { initialAppState } from "utilities/interfaces";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import "./App.scss";

/* Custom theme to ensure consistent UI elements */
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
  },
  props: {
    MuiCheckbox: {
      color: "primary",
    },
    MuiRadio: {
      color: "primary",
    },
    MuiSwitch: {
      color: "primary",
    },
  },
});

/* App with a HashRouter.
Ref: https://medium.com/@bennirus/deploying-a-create-react-app-with-routing-to-github-pages-f386b6ce84c2
*/
export const App = () => {
  const [isCSVLoading, setIsCSVLoading] = useState(false);
  const { save } = useLocal("appState");
  const [appState, appDispatch] = useReducer(reducer(save), initialAppState);

  return (
    <ThemeProvider theme={theme}>
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
                <Route path="/compare-settings">
                  <CompareSettingsPage />
                </Route>
                <Route path="/compare-results">
                  <CompareResultsPage />
                </Route>
                {/* <Route path="/harmony">
                  <HarmonyPage />
                </Route> */}
                <Route path="/">
                  <SchedulizerPage />
                </Route>
              </Switch>
            </div>
          </AppContext.Provider>
          <Footer />
        </HashRouter>
      </div>
    </ThemeProvider>
  );
};
