import { voidFn } from "utilities";
import { AppAction, AppState, ColorBy, Course, Schedule, SchedulizerTab, SemesterLength, Term } from "utilities/interfaces";
import {
  getClasses,
  getDepts,
  getMinAndMaxTimes,
  getProfs,
  getRooms,
  getTimes,
} from "utilities/services";

/*
  Provides a function to perform multiple setState updates
  at once that depend on each other.
  Can be initialized with a callback to be performed on
  any completed action.
*/
export const reducer = (actionCallback: (item: AppState) => void = voidFn) => {
  return (state: AppState, action: AppAction): AppState => {
    let newState: AppState;
    switch (action.type) {
      case "setScheduleData": {
        let { schedule, schedules, activeScheduleIds } = action.payload;
        schedule = schedule || { courses: [], numDistinctSchedules: 0 };

        // If schedules array is provided, use it; otherwise create a new array with just this schedule
        schedules = schedules || [schedule];

        // If activeScheduleIds is provided, use it; otherwise default to the first schedule
        activeScheduleIds = activeScheduleIds || (schedules.length > 0 ? [0] : []);

        const times = getMinAndMaxTimes(schedule);
        newState = {
          ...state,
          activeScheduleIds,
          classes: getClasses(schedule),
          departments: getDepts(schedule),
          professors: getProfs(schedule),
          rooms: getRooms(schedule),
          schedule,
          schedules,
          slotMaxTime: times.maxTime,
          slotMinTime: times.minTime,
          times: getTimes(schedule),
        };
        break;
      }
      case "addSchedule": {
        const { schedule } = action.payload;
        if (!schedule) {
          newState = { ...state };
          break;
        }

        // Add the schedule to the schedules array
        const updatedSchedules = [...state.schedules, schedule];
        const newScheduleId = updatedSchedules.length - 1;

        // Update activeScheduleIds to include the new schedule if it's the first one
        let activeScheduleIds = [...state.activeScheduleIds];
        if (updatedSchedules.length === 1) {
          activeScheduleIds = [0];
        }

        // Update the main schedule view with combined data for display
        const displaySchedule = combineActiveSchedules(updatedSchedules, activeScheduleIds);
        const times = getMinAndMaxTimes(displaySchedule);

        newState = {
          ...state,
          activeScheduleIds,
          classes: getClasses(displaySchedule),
          departments: getDepts(displaySchedule),
          professors: getProfs(displaySchedule),
          rooms: getRooms(displaySchedule),
          schedule: displaySchedule,
          schedules: updatedSchedules,
          slotMaxTime: times.maxTime,
          slotMinTime: times.minTime,
          times: getTimes(displaySchedule),
        };
        break;
      }
      case "setActiveScheduleIds": {
        const { activeScheduleIds } = action.payload;
        if (!activeScheduleIds || activeScheduleIds.length === 0) {
          // If no schedules are active, use empty schedule
          const emptySchedule = { courses: [], numDistinctSchedules: 0 };
          newState = {
            ...state,
            activeScheduleIds: [],
            classes: [],
            departments: [],
            professors: [],
            rooms: [],
            schedule: emptySchedule,
            slotMaxTime: "22:00",
            slotMinTime: "6:00",
            times: [],
          };
        } else {
          // Combine active schedules for display
          const displaySchedule = combineActiveSchedules(state.schedules, activeScheduleIds);
          const times = getMinAndMaxTimes(displaySchedule);

          newState = {
            ...state,
            activeScheduleIds,
            classes: getClasses(displaySchedule),
            departments: getDepts(displaySchedule),
            professors: getProfs(displaySchedule),
            rooms: getRooms(displaySchedule),
            schedule: displaySchedule,
            slotMaxTime: times.maxTime,
            slotMinTime: times.minTime,
            times: getTimes(displaySchedule),
          };
        }
        break;
      }
      case "setSelectedTerm": {
        let { selectedTerm } = action.payload;
        selectedTerm = selectedTerm || Term.Fall;
        newState = { ...state, selectedTerm };
        break;
      }
      case "setFileUrl": {
        let { fileUrl } = action.payload;
        fileUrl = fileUrl || "";
        newState = { ...state, fileUrl };
        break;
      }
      case "setColorBy": {
        let { colorBy } = action.payload;
        colorBy = colorBy || ColorBy.Level;
        newState = { ...state, colorBy };
        break;
      }
      case "setSelectedSemesterPart": {
        let { selectedSemesterPart } = action.payload;
        selectedSemesterPart = selectedSemesterPart || SemesterLength.Full;
        newState = { ...state, selectedSemesterPart };
        break;
      }
      case "setSchedulizerTab": {
        let { schedulizerTab } = action.payload;
        schedulizerTab = schedulizerTab || SchedulizerTab.Faculty;
        newState = { ...state, schedulizerTab };
        break;
      }
      case "setConstraints": {
        let { constraints } = action.payload;
        constraints = constraints || {};
        newState = { ...state, constraints };
        break;
      }
      default:
        return state;
    }
    actionCallback(newState);
    return newState;
  };
};

/**
 * Combines multiple schedules from the schedules array based on the active IDs
 *
 * @param schedules Array of all schedules
 * @param activeIds Array of active schedule IDs to combine
 * @returns A combined schedule containing courses from all active schedules
 */
export const combineActiveSchedules = (schedules: AppState["schedules"], activeIds: AppState["activeScheduleIds"]) => {
  if (!schedules.length || !activeIds.length) {
    return { courses: [], numDistinctSchedules: 0 };
  }

  // Start with an empty combined schedule
  const combinedSchedule: Schedule = { courses: [], numDistinctSchedules: schedules.length };

  // Add courses from each active schedule
  activeIds.forEach(id => {
    if (id < 0 || id >= schedules.length) {
      return; // Skip invalid IDs
    }

    const schedule = schedules[id];
    if (!schedule) {
      return; // Skip if schedule doesn't exist
    }

    // Set importRank to the schedule ID for easier identification
    schedule.courses.forEach(course => {
      // Create a deep copy to avoid modifying the original
      const courseCopy: Course = JSON.parse(JSON.stringify(course));
      courseCopy.importRank = id;
      combinedSchedule.courses.push(courseCopy);
    });
  });

  return combinedSchedule;
};
