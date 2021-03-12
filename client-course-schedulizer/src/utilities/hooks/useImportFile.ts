import { isEqual } from "lodash";
import { ChangeEvent, useContext } from "react";
import { Course, csvStringToSchedule, Schedule } from "utilities";
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
        scheduleString = getCSVFromXLSXData(reader.result as ArrayBufferLike);
      } else {
        scheduleString = String(reader.result);
      }
      scheduleJSON = csvStringToSchedule(scheduleString);

      !isAdditiveImport && appDispatch({ payload: { fileUrl: "" }, type: "setFileUrl" });
      await updateScheduleInContext(schedule, scheduleJSON, appDispatch, isAdditiveImport);
      setIsCSVLoading(false);
    };
  };

  return onInputChange;
};

/**
 * Update the Schedule information in the context
 * @param currentSchedule
 * @param newSchedule
 * @param appDispatch
 * @param isAdditiveImport
 *
 * Ref: https://stackoverflow.com/a/57214316/9931154
 */
export const updateScheduleInContext = async (
  currentSchedule: Schedule,
  newSchedule: Schedule,
  appDispatch: AppContext["appDispatch"],
  isAdditiveImport = false,
) => {
  if (!isEqual(currentSchedule, newSchedule)) {
    let newScheduleData: Schedule;
    if (isAdditiveImport) {
      newScheduleData = {
        courses: combineSchedules(currentSchedule, newSchedule),
      };
    } else {
      newScheduleData = newSchedule;
    }
    await appDispatch({ payload: { schedule: newScheduleData }, type: "setScheduleData" });
  }
};

/**
 * Convert XLSX Data to CSV
 *
 * @param  {ArrayBufferLike} xlsxData
 * @returns string
 */
export const getCSVFromXLSXData = (xlsxData: ArrayBufferLike): string => {
  const data = new Uint8Array(xlsxData);
  const workBook = read(data, { type: "array" });
  const firstSheet = workBook.Sheets[workBook.SheetNames[0]];
  return utils.sheet_to_csv(firstSheet);
};

/**
 * Combine two schedule courses together.
 *
 * @param  {Schedule} currentSchedule
 * @param  {Schedule} newSchedule
 */
const combineSchedules = (currentSchedule: Schedule, newSchedule: Schedule) => {
  const coursesSet = new Set<Course>([...currentSchedule.courses]);
  newSchedule.courses.forEach((newCourse) => {
    mergeWithNoDuplicateCourses(currentSchedule, newCourse, coursesSet);
  });
  return [...coursesSet];
};

/**
 * Create a set of unique corses between two schedules.
 *
 * NOTE: The course objects must be identical for isEqual to find the duplicate.
 * TODO: would using a different data structure, like a hash map, be better (faster)?
 *
 * @param  {Schedule} currentSchedule
 * @param  {Course} newCourse
 * @param  {Set<Course>} coursesSet
 */
const mergeWithNoDuplicateCourses = (
  currentSchedule: Schedule,
  newCourse: Course,
  coursesSet: Set<Course>,
) => {
  let isDuplicate = false;
  currentSchedule.courses.forEach((currentCourse) => {
    // Short-circuit if a duplicate is found.
    if (!isDuplicate && isEqual(newCourse, currentCourse)) {
      isDuplicate = true;
    }
  });
  if (!isDuplicate) {
    coursesSet.add(newCourse);
  }
};
