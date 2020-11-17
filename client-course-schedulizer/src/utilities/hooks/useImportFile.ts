import { isEqual } from "lodash";
import { ChangeEvent, useContext } from "react";
import { AppContext } from "../services/appContext";
import * as readCSV from "../helpers/readCSV";

// A closure with statefulness. Used to handle changes to inputs
export const useImportFile = () => {
  const {
    appState: { schedule },
    appDispatch,
    setIsCSVLoading,
  } = useContext(AppContext);

  // TODO: this only runs when input changes, but if the same file
  // is uploaded, this will not run.
  // https://stackoverflow.com/questions/5201317/read-the-contents-of-a-file-object
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsCSVLoading(true);
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
      setIsCSVLoading(false);
    };
  };

  return onInputChange;
};
