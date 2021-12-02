import { AddSectionButton, ColorSelector, Searchbar, SemesterSelector } from "components";
import React, { useContext } from "react";
import { AppContext } from "utilities/contexts";
import "./ScheduleToolbar.scss";

export const ScheduleToolbar = () => {
  const {
    appState: { fileUrl },
  } = useContext(AppContext);

  return (
    <div className="schedule-toolbar">
      <div className="toolbar-left">
        <Searchbar />
        <ColorSelector />
      </div>
      <div>{fileUrl ? `Imported URL: ${fileUrl}` : ""}</div>
      <div className="toolbar-right">
        <SemesterSelector />
        <AddSectionButton value="false" />
      </div>
    </div>
  );
};
