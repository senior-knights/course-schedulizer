import download from "js-file-download";
import moment from "moment";
import { useContext } from "react";
import { AppContext, scheduleToCSVString } from "utilities";

/* Hook that downloads the current schedule when onExportClick
 is executed. */
export const useExportCSV = () => {
  const {
    appState: { schedule },
  } = useContext(AppContext);

  const onExportClick = () => {
    // TODO: maybe generate a cool title like schedule-fall-2020.csv
    download(scheduleToCSVString(schedule), `schedule_${moment().format()}.csv`);
  };
  return onExportClick;
};
