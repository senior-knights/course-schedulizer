import { Input, InputLabel } from "@material-ui/core";
import React, { useContext } from "react";
import download from "js-file-download";
import * as writeCSV from "../../../utilities/helpers/writeCSV";
import { ScheduleContext } from "../../../utilities/services/context";

export const ExportButton = () => {
  const { schedule } = useContext(ScheduleContext);

  const onExportClick = () => {
    // TODO: maybe generate a cool title like schedule-fall-2020.csv
    download(writeCSV.scheduleToCSVString(schedule), "schedule.csv");
  };

  return (
    <InputLabel className="export-label" htmlFor="export-button">
      <Input className="hidden" id="export-button" onClick={onExportClick} />
      Export CSV
    </InputLabel>
  );
};
