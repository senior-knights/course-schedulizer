import { ThemeProvider } from "@material-ui/core";
import React from "react";
import { theme } from "../../styles/theme";
import { Header } from "../Header";
import { SchedulizerTabs } from "../SchedulizerTabs";
import "./App.scss";

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Header />
        <SchedulizerTabs />
      </div>
    </ThemeProvider>
  );
};
