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
    const fileName = file?.name || "";
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
      case "json": {
        file && reader.readAsText(file);
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
      } else if (fileType === "csv") {
        scheduleString = String(reader.result);
      } else {
        const newConstraints = JSON.parse(String(reader.result));
        if(newConstraints.constraints) {
          newConstraints.constraints.forEach((constraintData: string[]) => {
            constraintData.forEach((course: string) => {
              newConstraints[course] = constraintData.filter((c) => { return c !== course });
            })
          });
          delete newConstraints.constraints;
        }
        appDispatch({ payload: { constraints: newConstraints }, type: "setConstraints" });
        scheduleString = "";
      }
      scheduleJSON = csvStringToSchedule(scheduleString);

      // Set the schedule name to the file name
      if (fileName) {
        scheduleJSON.name = fileName;
      }

      !isAdditiveImport && appDispatch({ payload: { fileUrl: "" }, type: "setFileUrl" });

      if (fileType === "json") {
        // Already handled constraints
        setIsCSVLoading(false);
      } else if (isAdditiveImport) {
        // Use the new addSchedule action for adding a new schedule
        await appDispatch({ payload: { schedule: scheduleJSON }, type: "addSchedule" });
        setIsCSVLoading(false);
      } else {
        // Replace the current schedules with a new one
        await appDispatch({
          payload: {
            activeScheduleIds: [0],
            schedule: scheduleJSON,
            schedules: [scheduleJSON],
          },
          type: "setScheduleData",
        });
        setIsCSVLoading(false);
      }
    };
  };

  return onInputChange;
};

/**
 * Converts XLSX data to CSV string.
 *
 * @param  {ArrayBufferLike} data
 * @returns string
 */
export const getCSVFromXLSXData = (data: ArrayBufferLike): string => {
  const workbook = read(data, { type: "array" });
  const worksheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[worksheetName];
  return utils.sheet_to_csv(worksheet);
};
