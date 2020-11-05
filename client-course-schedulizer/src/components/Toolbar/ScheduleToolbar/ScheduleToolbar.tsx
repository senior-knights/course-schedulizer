import React from "react";
import { AddSectionButton } from "../AddSectionButton";
import { ColorSelector } from "../ColorSelector/ColorSelector";
import { Searchbar } from "../Searchbar";
import { SemesterSelector } from "../SemesterSelector";
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
