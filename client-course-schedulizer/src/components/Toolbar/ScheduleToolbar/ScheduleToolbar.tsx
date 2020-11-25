import { AddSectionButton, ColorSelector, Searchbar, SemesterSelector } from "components";
import React from "react";
import "./ScheduleToolbar.scss";

export const ScheduleToolbar = () => {
  return (
    <div className="schedule-toolbar">
      <div className="toolbar-left">
        <Searchbar />
        <ColorSelector />
      </div>
      <div className="toolbar-right">
        <SemesterSelector />
        <AddSectionButton />
      </div>
    </div>
  );
};
