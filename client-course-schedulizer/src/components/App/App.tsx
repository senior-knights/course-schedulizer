import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.scss";
import { AboutPage, HelpPage, SchedulizerPage } from "../pages";
import { Header } from "../Header/Header";

export const App = () => {
  return (
    <div className="App">
      <Router>
        <Header />
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
      </Router>
    </div>
  );
};
