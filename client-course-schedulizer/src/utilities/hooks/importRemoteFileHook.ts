import { useContext } from "react";
import { csvStringToSchedule, getCSVFromXLSXData, updateScheduleInContext } from "utilities";
import { AppContext } from "utilities/contexts";

export const useImportRemoteFile = () => {
  const {
    appState: { schedule, fileUrl },
    appDispatch,
    setIsCSVLoading,
  } = useContext(AppContext);

  // Load a file from the GET parameters (either ?csv= or ?xlsx=)
  // only do this once for each page refresh, then redirect to the page without the GET params
  // this will erase existing work!
  // Ref: https://stackoverflow.com/questions/56663785/invalid-hook-call-hooks-can-only-be-called-inside-of-the-body-of-a-function-com
  // Ref: https://www.gitmemory.com/issue/SheetJS/js-xlsx/1110/531003740
  const importRemoteFile = () => {
    // eslint-disable-next-line no-restricted-globals
    const url = location.href;
    // TODO: We'll need to be more careful about this if we end up using more GET params
    const getCSVStr = "?csv=";
    const getXLSXStr = "?xlsx=";
    const csvIndex = url.indexOf(getCSVStr);
    const xlsxIndex = url.indexOf(getXLSXStr);
    if (csvIndex !== -1) {
      const csvUrl = url.slice(csvIndex + getCSVStr.length);
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
            appDispatch({ payload: { fileUrl: csvUrl }, type: "setFileUrl" });
            if (result) {
              const newSchedule = csvStringToSchedule(result);
              await updateScheduleInContext(schedule, newSchedule, appDispatch);
              clearSearchParams();
            } else {
              setIsCSVLoading(false);
              clearSearchParams();
            }
          });
      } else {
        clearSearchParams();
      }
    } else if (xlsxIndex !== -1) {
      const xlsxUrl = url.slice(xlsxIndex + getXLSXStr.length);
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
            appDispatch({ payload: { fileUrl: xlsxUrl }, type: "setFileUrl" });
            if (result) {
              const newSchedule = csvStringToSchedule(
                getCSVFromXLSXData(result as ArrayBufferLike),
              );
              await updateScheduleInContext(schedule, newSchedule, appDispatch);
              clearSearchParams();
            } else {
              setIsCSVLoading(false);
              clearSearchParams();
            }
          });
      } else {
        clearSearchParams();
      }
    }
  };

  return { importRemoteFile };
};

const clearSearchParams = () => {
  // eslint-disable-next-line no-restricted-globals
  location.href = "";
};
