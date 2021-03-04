import { useContext } from "react";
import { csvStringToSchedule, updateScheduleInContext } from "utilities";
import { AppContext } from "utilities/contexts";
import { read, utils } from "xlsx";

export const useImportRemoteFile = () => {
  const {
    appState: { schedule, fileUrl },
    appDispatch,
    setIsCSVLoading,
  } = useContext(AppContext);

  // Load a file from the GET parameters (either ?csv= or ?xlsx=)
  // only do this once for each page refresh and only do this if the initial state is empty
  // Ref: https://stackoverflow.com/questions/56663785/invalid-hook-call-hooks-can-only-be-called-inside-of-the-body-of-a-function-com
  // Ref: https://www.gitmemory.com/issue/SheetJS/js-xlsx/1110/531003740
  const importRemoteFile = () => {
    const scheduleHasCourses = schedule.courses.length > 0;
    if (!scheduleHasCourses) {
      // eslint-disable-next-line no-restricted-globals
      const url = location.href;
      // TODO: We'll need to be more careful about this if we end up using more GET params
      const csvIndex = url.indexOf("?csv=");
      const xlsxIndex = url.indexOf("?xlsx=");
      if (csvIndex !== -1) {
        const csvUrl = url.slice(csvIndex + 5);
        if (csvUrl !== "" && csvUrl !== fileUrl) {
          setIsCSVLoading(true);
          fetch(csvUrl)
            .then((response) => {
              if (response.status === 404) {
                return null;
              }
              return response.text();
            })
            .then(async (result) => {
              await appDispatch({ payload: { fileUrl: csvUrl }, type: "setFileUrl" });
              if (result) {
                const newSchedule = csvStringToSchedule(result);
                await updateScheduleInContext(schedule, newSchedule, appDispatch, setIsCSVLoading);
              } else {
                setIsCSVLoading(false);
              }
            });
        }
      } else if (xlsxIndex !== -1) {
        const xlsxUrl = url.slice(xlsxIndex + 6);
        if (xlsxUrl !== "" && xlsxUrl !== fileUrl) {
          setIsCSVLoading(true);
          fetch(xlsxUrl)
            .then((response) => {
              if (response.status === 404) {
                return null;
              }
              return response.arrayBuffer();
            })
            .then(async (result) => {
              await appDispatch({ payload: { fileUrl: xlsxUrl }, type: "setFileUrl" });
              if (result) {
                const uploadedData = new Uint8Array(result as ArrayBufferLike);
                const workBook = read(uploadedData, { type: "array" });
                const firstSheet = workBook.Sheets[workBook.SheetNames[0]];
                const newSchedule = csvStringToSchedule(utils.sheet_to_csv(firstSheet));
                await updateScheduleInContext(schedule, newSchedule, appDispatch, setIsCSVLoading);
              } else {
                setIsCSVLoading(false);
              }
            });
        }
      }
    }
  };

  return { importRemoteFile };
};
