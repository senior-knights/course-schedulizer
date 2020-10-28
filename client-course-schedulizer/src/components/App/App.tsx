import React from "react";
import { Header } from "../Header/Header";
import { Tabs } from "../Tabs";
import "./App.scss";

export const App = () => {
  return (
    <div className="App">
      <Header />
      <Tabs />
    </div>
  );
};
