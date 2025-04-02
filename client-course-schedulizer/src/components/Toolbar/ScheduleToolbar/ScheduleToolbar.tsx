import { AddSectionButton, ColorSelector, ScheduleSelector, SemesterSelector } from "components";
import React, { useContext } from "react";
import { AppContext } from "utilities/contexts";
import { CompareButton } from "../../Tabs/tabComponents/CompareButton/CompareButton";
import { SemesterPartSelector } from "../SemesterPartSelector";
import "./ScheduleToolbar.scss";

export const ScheduleToolbar = () => {
  const {
    appState: { fileUrl, schedules },
  } = useContext(AppContext);

  // Only show the compare button if we have multiple schedules
  const showCompareButton = schedules.length > 1;

  return (
    <div className="schedule-toolbar">
      <div className="toolbar-left">
        <ColorSelector />
        <SemesterPartSelector />
      </div>
      <div className="toolbar-center">
        {fileUrl ? `Imported URL: ${fileUrl}` : ""}
        <div className="schedule-selector-position">
          <ScheduleSelector />
          {showCompareButton && <CompareButton />}
        </div>
      </div>
      <div className="toolbar-right">
        <SemesterSelector />
        <AddSectionButton />
      </div>
    </div>
  );
};
