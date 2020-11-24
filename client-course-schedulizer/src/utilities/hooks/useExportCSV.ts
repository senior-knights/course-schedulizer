import { useContext } from "react";
import download from "js-file-download";
import moment from "moment";
import { AppContext } from "../services/appContext";
import * as writeCSV from "../helpers/writeCSV";

/* Hook that downloads the current schedule when onExportClick
 is executed. */
export const useExportCSV = () => {
  const {
    appState: { schedule },
  } = useContext(AppContext);

  const onExportClick = () => {
    // TODO: maybe generate a cool title like schedule-fall-2020.csv
    download(writeCSV.scheduleToCSVString(schedule), `schedule_${moment().format()}.csv`);
  };
  return onExportClick;
};
