import React from "react";
import { Header } from "../Header";
import { SchedulizerTabs } from "../SchedulizerTabs";
import "./App.scss";

export const App = () => {
  return (
    <div className="App">
      <Header />
      <SchedulizerTabs />
    </div>
  );
};
