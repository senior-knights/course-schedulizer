import { isEqual } from "lodash";
import { ChangeEvent, useContext } from "react";
import { csvStringToSchedule, Schedule } from "utilities";
import { AppContext } from "utilities/contexts";
import { read, utils } from "xlsx";

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
    const file: File | null = e.target.files && e.target.files[0];
    const reader = new FileReader();

    const fileNameTokens = file?.name.split(".") || [];
    const fileType = fileNameTokens[fileNameTokens.length - 1];
    let scheduleJSON: Schedule;

    switch (fileType) {
      case "xlsx": {
        file && reader.readAsArrayBuffer(file);
        reader.onloadend = async () => {
          scheduleJSON = csvStringToSchedule(getCSVFromXLSXData(reader.result as ArrayBufferLike));

          await appDispatch({ payload: { fileUrl: "" }, type: "setFileUrl" });
          await updateScheduleInContext(schedule, scheduleJSON, appDispatch, setIsCSVLoading);
        };
        break;
      }
      case "csv": {
        file && reader.readAsBinaryString(file);
        reader.onloadend = async () => {
          const scheduleString = String(reader.result);
          scheduleJSON = csvStringToSchedule(scheduleString);

          await appDispatch({ payload: { fileUrl: "" }, type: "setFileUrl" });
          await updateScheduleInContext(schedule, scheduleJSON, appDispatch, setIsCSVLoading);
        };
        break;
      }
      default: {
        throw Error(`FileType ${fileType} not supported.`);
      }
    }

    reader.onloadend = async () => {
      let scheduleString: string;
      if (fileType === "xlsx") {
        scheduleString = getCSVFromXLSXData(reader.result as ArrayBufferLike);
      } else {
        scheduleString = String(reader.result);
      }
      scheduleJSON = csvStringToSchedule(scheduleString);

      // TODO: store in local storage incase prof navigates away while editing.
      // currently a redundant check
      if (!isEqual(schedule, scheduleJSON)) {
        await appDispatch({ payload: { fileUrl: "" }, type: "setFileUrl" });
        await appDispatch({ payload: { schedule: scheduleJSON }, type: "setScheduleData" });
      }
      setIsCSVLoading(false);
    };
  };

  return onInputChange;
};

export const updateScheduleInContext = async (
  schedule: Schedule,
  scheduleJSON: Schedule,
  appDispatch: AppContext["appDispatch"],
  setIsCSVLoading: AppContext["setIsCSVLoading"],
) => {
  // TODO: store in local storage incase prof navigates away while editing.
  // currently a redundant check
  if (!isEqual(schedule, scheduleJSON)) {
    await appDispatch({ payload: { schedule: scheduleJSON }, type: "setScheduleData" });
  }
  setIsCSVLoading(false);
};

export const getCSVFromXLSXData = (xlsxData: ArrayBufferLike): string => {
  const data = new Uint8Array(xlsxData);
  const workBook = read(data, { type: "array" });
  const sheet = workBook.Sheets[workBook.SheetNames[0]];
  return utils.sheet_to_csv(sheet);
};
