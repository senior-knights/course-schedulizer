import download from "js-file-download";
import moment from "moment";
import { useContext } from "react";
import { scheduleToFullCSVString } from "utilities";
import { AppContext } from "utilities/contexts";

/* Hook that downloads the current schedule when onFullExportClick
 is executed. */
export const useExportFullCSV = () => {
  const {
    appState: { schedule },
  } = useContext(AppContext);

  const onFullExportClick = () => {
    // TODO: maybe generate a cool title like full-schedule-fall-2020.csv
    download(scheduleToFullCSVString(schedule), `full_schedule_${moment().format()}.csv`);
  };
  return onFullExportClick;
};
