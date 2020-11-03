import { Input, InputLabel } from "@material-ui/core";
import React, { ChangeEvent, useEffect, useState } from "react";
import * as readCSV from "../../../utilities/helpers/readCSV";
import * as writeCSV from "../../../utilities/helpers/writeCSV";
import "./ImportButton.scss";

export const ImportButton = () => {
  const [file, setFile] = useState<Blob>();

  useEffect(() => {
    // https://stackoverflow.com/questions/5201317/read-the-contents-of-a-file-object
    const read = new FileReader();
    file && read.readAsBinaryString(file);

    read.onloadend = () => {
      const schedule = readCSV.csvStringToSchedule(String(read.result));
      // eslint-disable-next-line no-console
      console.log(schedule);
      // eslint-disable-next-line no-console
      console.log(writeCSV.scheduleToCSVString(schedule));
    };
  }, [file]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.files && setFile(e.target.files[0]);
  };

  return (
    <InputLabel className="import-label" htmlFor="import-button">
      <Input
        className="hidden"
        id="import-button"
        inputProps={{
          accept: ".csv",
        }}
        onChange={onInputChange}
        type="file"
      />
      Import CSV
    </InputLabel>
  );
};
