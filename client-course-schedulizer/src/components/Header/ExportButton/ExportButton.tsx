import { Input, InputLabel } from "@material-ui/core";
import React, { useContext } from "react";
import * as writeCSV from "../../../utilities/helpers/writeCSV";
import { ScheduleContext } from "../../../utilities/services/context";
import "./ExportButton.scss";

// From https://stackoverflow.com/a/18197341/14478665
const download = (filename: string, text: string) => {
  const element = document.createElement("a");
  element.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

export const ExportButton = () => {
  const { schedule } = useContext(ScheduleContext);

  const onExportClick = () => {
    // TODO: maybe generate a cool title like schedule-fall-2020.csv
    download("schedule.csv", writeCSV.scheduleToCSVString(schedule));
  };

  return (
    <InputLabel className="export-label" htmlFor="export-button">
      <Input className="hidden" id="export-button" onClick={onExportClick} />
      Export CSV
    </InputLabel>
  );
};
