import { Input, InputLabel } from "@material-ui/core";
import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import * as readCSV from "../../../utilities/helpers/readCSV";
import { ScheduleContext } from "../../../utilities/services/context";
import "./ImportButton.scss";

export const ImportButton = () => {
  const [file, setFile] = useState<Blob>();
  const { setSchedule } = useContext(ScheduleContext);

  useEffect(() => {
    // https://stackoverflow.com/questions/5201317/read-the-contents-of-a-file-object
    const read = new FileReader();
    file && read.readAsBinaryString(file);

    read.onloadend = () => {
      const scheduleJSON = readCSV.csvStringToSchedule(String(read.result));
      // TODO: store in local state incase prof navigates away while editing.
      setSchedule(scheduleJSON);
      // eslint-disable-next-line no-console
      console.log(scheduleJSON);
    };
  }, [file, setSchedule]);

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
