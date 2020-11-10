import { Input, InputLabel } from "@material-ui/core";
import React, { ChangeEvent, useContext } from "react";
import isEqual from "lodash/isEqual";
import * as readCSV from "../../../utilities/helpers/readCSV";
import { ScheduleContext } from "../../../utilities/services/context";
import "./ImportButton.scss";
import { getProfs } from "../../../utilities/services/facultySchedule";

export const ImportButton = () => {
  const { schedule, setSchedule, setProfessors } = useContext(ScheduleContext);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    // TODO: add setLoading to true.
    const file: Blob | null = e.target.files && e.target.files[0];
    const read = new FileReader();
    file && read.readAsBinaryString(file);

    read.onloadend = () => {
      const scheduleJSON = readCSV.csvStringToSchedule(String(read.result));
      // TODO: store in local state incase prof navigates away while editing.
      if (!isEqual(schedule, scheduleJSON)) {
        setSchedule(scheduleJSON);
        setProfessors(getProfs(scheduleJSON));
      }
      // TODO: set setLoading to false
    };
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
