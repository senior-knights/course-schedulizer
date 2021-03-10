import { isEqual } from "lodash";
import { ChangeEvent, useContext } from "react";
import { csvStringToSchedule, Schedule } from "utilities";
import { AppContext } from "utilities/contexts";
import { read, utils } from "xlsx";

/**
 * Hook that returns function to handle file uploaded
 *   and store it in local state.
 *
 * @param  {boolean} isAdditiveImport
 * @returns void
 *
 * Ref: https://stackoverflow.com/questions/5201317/read-the-contents-of-a-file-object
 */
export const useImportFile = (isAdditiveImport: boolean) => {
  const {
    appState: { schedule },
    appDispatch,
    setIsCSVLoading,
  } = useContext(AppContext);

  /**
   * Used to handle changes to inputs when files are uploaded.
   */
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsCSVLoading(true);

    const file: File | null = e.target.files && e.target.files[0];
    const fileNameTokens = file?.name.split(".") || [];
    const fileType = fileNameTokens[fileNameTokens.length - 1];
    const reader = new FileReader();
    let scheduleJSON: Schedule;

    switch (fileType) {
      case "xlsx": {
        file && reader.readAsArrayBuffer(file);
        break;
      }
      case "csv": {
        file && reader.readAsBinaryString(file);
        break;
      }
      default: {
        throw Error(`FileType ${fileType} not supported.`);
      }
    }

    reader.onloadend = async () => {
      let scheduleString: string;
      if (fileType === "xlsx") {
        const uploadedData = new Uint8Array(reader.result as ArrayBufferLike);
        const workBook = read(uploadedData, { type: "array" });
        const firstSheet = workBook.Sheets[workBook.SheetNames[0]];
        scheduleString = utils.sheet_to_csv(firstSheet);
      } else {
        scheduleString = String(reader.result);
      }
      scheduleJSON = csvStringToSchedule(scheduleString);
      await updateScheduleInContext(schedule, scheduleJSON, appDispatch, isAdditiveImport);
      setIsCSVLoading(false);
    };
  };

  return onInputChange;
};

/**
 * Update the Schedule information in the context
 * @param currentSchedule
 * @param scheduleJSON
 * @param appDispatch
 * @param isAdditiveImport
 *
 * Ref: https://stackoverflow.com/a/57214316/9931154
 */
const updateScheduleInContext = async (
  currentSchedule: Schedule,
  scheduleJSON: Schedule,
  appDispatch: AppContext["appDispatch"],
  isAdditiveImport: boolean,
) => {
  if (!isEqual(currentSchedule, scheduleJSON)) {
    let newScheduleData: Schedule;
    if (isAdditiveImport) {
      newScheduleData = {
        courses: [...new Set([...currentSchedule.courses, ...scheduleJSON.courses])],
      };
    } else {
      newScheduleData = scheduleJSON;
    }
    await appDispatch({ payload: { schedule: newScheduleData }, type: "setScheduleData" });
  }
};
