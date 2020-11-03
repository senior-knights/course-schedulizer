import { Input, InputLabel } from "@material-ui/core";
import React, { ChangeEvent, useEffect, useState } from "react";
import * as readCSV from "../../../utilities/helpers/readCSV";
import * as writeCSV from "../../../utilities/helpers/writeCSV";
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
  const [file, setFile] = useState<Blob>();

  useEffect(() => {
    // https://stackoverflow.com/questions/5201317/read-the-contents-of-a-file-object
    const read = new FileReader();
    file && read.readAsBinaryString(file);

    read.onloadend = () => {
      download(
        "schedule.csv",
        writeCSV.scheduleToCSVString(readCSV.csvStringToSchedule(String(read.result))),
      );
    };
  }, [file]);

  const onExportChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.files && setFile(e.target.files[0]);
  };

  return (
    <InputLabel className="export-label" htmlFor="export-button">
      <Input
        className="hidden"
        id="export-button"
        inputProps={{
          accept: ".csv",
        }}
        onChange={onExportChange}
        type="file"
      />
      Export CSV
    </InputLabel>
  );
};
