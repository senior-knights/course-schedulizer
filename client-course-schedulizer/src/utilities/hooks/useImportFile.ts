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
      let metadataFound = false;

      // Clear existing metadata when importing a new file (not for additive imports)
      if (!isAdditiveImport) {
        clearMetadata();
      }

      if (fileType === "xlsx") {
        // For XLSX files, first check if there's a metadata sheet
        const workbook = read(reader.result as ArrayBufferLike, { type: "array" });

        // Extract metadata if available in the file
        metadataFound = extractMetadataFromWorkbook(workbook);

        // Get CSV data from the first sheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        scheduleString = utils.sheet_to_csv(worksheet);
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
 * Clears all metadata from localStorage
 */
const clearMetadata = (): void => {
  localStorage.removeItem("schedulizerNotes");
  localStorage.removeItem("schedulizerVersion");
  localStorage.removeItem("schedulizerYear");
};

/**
 * Extracts metadata from an XLSX workbook and updates localStorage
 * @param workbook XLSX workbook object
 * @returns boolean indicating if any metadata was found
 */
const extractMetadataFromWorkbook = (workbook: any): boolean => {
  // Look for a metadata sheet (case insensitive)
  const metadataSheetName = workbook.SheetNames.find((name: string) => {
    return name.toLowerCase() === "metadata";
  });

  if (metadataSheetName) {
    try {
      const metadataSheet = workbook.Sheets[metadataSheetName];
      const metadataArray = utils.sheet_to_json(metadataSheet);

      let foundMetadata = false;

      // Process metadata
      metadataArray.forEach((item: any) => {
        if (item.Label && item.Value) {
          foundMetadata = true;
          switch (item.Label) {
            case "Academic Year":
              localStorage.setItem("schedulizerYear", item.Value.toString());
              break;
            case "Version":
              localStorage.setItem("schedulizerVersion", item.Value.toString());
              break;
            case "Notes":
              localStorage.setItem("schedulizerNotes", item.Value.toString());
              break;
          }
        }
      });

      return foundMetadata;
    } catch (error) {
      console.error("Error parsing metadata sheet:", error);
      return false;
    }
  }

  return false;
};

/**
 * Converts XLSX data to CSV string.
 *
 * @param  {ArrayBufferLike} data
 * @returns string
 */
export const getCSVFromXLSXData = (data: ArrayBufferLike): string => {
  const workbook = read(data, { type: "array" });

  // Clear existing metadata before checking for new metadata
  clearMetadata();

  // Extract metadata when loading remote XLSX files
  extractMetadataFromWorkbook(workbook);

  const worksheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[worksheetName];
  return utils.sheet_to_csv(worksheet);
};
