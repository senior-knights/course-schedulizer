import { AddSectionButton, ColorSelector, Searchbar, SemesterSelector} from "components";
import React, { useContext } from "react";
import { AppContext } from "utilities/contexts";
import { SemesterPartSelector } from "../SemesterPartSelector";
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
        <SemesterPartSelector />
      </div>
      <div>{fileUrl ? `Imported URL: ${fileUrl}` : ""}</div>
      <div className="toolbar-right">
        <SemesterSelector />
        <AddSectionButton />
      </div>
    </div>
  );
};
