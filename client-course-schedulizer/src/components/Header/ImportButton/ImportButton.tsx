import { Input, InputLabel } from "@material-ui/core";
import React, { ChangeEvent, useContext } from "react";
import isEqual from "lodash/isEqual";
import * as readCSV from "../../../utilities/helpers/readCSV";
import { AppContext } from "../../../utilities/services/appContext";

export const ImportButton = () => {
  const {
    appState: { schedule },
    appDispatch,
    setIsLoading,
  } = useContext(AppContext);

  // TODO: this only runs when input changes, but if the same file
  // is uploaded, this will not run.
  // https://stackoverflow.com/questions/5201317/read-the-contents-of-a-file-object
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const file: Blob | null = e.target.files && e.target.files[0];
    const read = new FileReader();
    file && read.readAsBinaryString(file);

    read.onloadend = () => {
      const scheduleJSON = readCSV.csvStringToSchedule(String(read.result));
      // TODO: store in local storage incase prof navigates away while editing.
      // currently a redundant check
      if (!isEqual(schedule, scheduleJSON)) {
        appDispatch({ payload: { schedule: scheduleJSON }, type: "setScheduleData" });
      }
      setIsLoading(false);
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
