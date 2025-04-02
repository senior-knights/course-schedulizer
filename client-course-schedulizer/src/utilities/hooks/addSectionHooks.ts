import { camelCase, forEach } from "lodash";
import moment from "moment";
import { useContext } from "react";
import { DeepMap, FieldError } from "react-hook-form";
import { insertSectionCourse} from "utilities";
import { AppContext } from "utilities/contexts";
import { isStandardTime } from "utilities/";
import {
  AppAction,
  Course,
  CourseSectionMeeting,
  SchedulizerTab,
  Section,
  Term,
} from "utilities/interfaces";
import { combineActiveSchedules } from "utilities/reducers/appReducer";
import {
  createEventClassName,
  handleOldMeeting,
  mapInputToInternalTypes,
  NonTeachingLoadInput,
  SectionInput,
} from "utilities/services";
import { mapNonTeachingLoadInput } from "utilities/services/addNonTeachingLoadService";

interface MappedSection {
  newCourse: Course;
  newSection: Section;
}

interface AddToScheduleParams {
  newCourse: Course;
  newSection: Section;
  oldData: CourseSectionMeeting | undefined;
  removeOldMeeting: boolean;
}

export const useAddSectionToSchedule = () => {
  const {
    appState: { schedule, selectedTerm, schedulizerTab, schedules, activeScheduleIds },
    appDispatch,
    setIsCSVLoading,
  } = useContext(AppContext);

  // Update the schedule via pass by sharing.
  const addSectionToSchedule = async (
    data: SectionInput,
    oldData: CourseSectionMeeting | undefined,
    removeOldMeeting = false,
  ) => {
    setIsCSVLoading(true);
    const { newSection, newCourse }: MappedSection = mapInputToInternalTypes(data);
    addToSchedule({ newCourse, newSection, oldData, removeOldMeeting });

    // Depending on the current tab, scroll to the updated/added section/row
    if (schedulizerTab === SchedulizerTab.Faculty || schedulizerTab === SchedulizerTab.Room) {
      await switchToCorrectTerm(newSection, selectedTerm, appDispatch);
      setIsCSVLoading(false);
      scrollToUpdatedSection(newCourse, newSection);
    } else if (schedulizerTab === SchedulizerTab.Loads) {
      setIsCSVLoading(false);
      // TODO: This may not be the row clicked on if there are multiple instructors?
      scrollToUpdatedFacultyRow(newSection.instructors[newSection.instructors.length - 1]);
    } else {
      setIsCSVLoading(false);
    }
  };

  const addNonTeachingLoadToSchedule = (
    data: NonTeachingLoadInput,
    oldData: CourseSectionMeeting | undefined,
    removeOldMeeting = false,
  ) => {
    setIsCSVLoading(true);
    const { newCourse, newSection }: MappedSection = mapNonTeachingLoadInput(data);
    addToSchedule({ newCourse, newSection, oldData, removeOldMeeting });
    setIsCSVLoading(false);
    scrollToUpdatedFacultyRow(newSection.instructors[newSection.instructors.length - 1]);
  };


  const addToSchedule = ({
    newCourse,
    newSection,
    oldData,
    removeOldMeeting,
  }: AddToScheduleParams) => {
    newSection.timestamp = moment().format();
    newSection.meetings.forEach((meeting) => {
      meeting.isNonstandardTime = !isStandardTime(meeting)
    });

    // Create a copy of the schedules array
    const updatedSchedules = [...schedules];

    // If this is an update operation (has oldData and removeOldMeeting is true),
    // find which schedule the section belongs to
    let targetScheduleIds: number[] = [...activeScheduleIds];

    if (removeOldMeeting && oldData?.course && oldData?.section) {
      // Find which schedule(s) contain the section being updated
      targetScheduleIds = updatedSchedules.map((schedule, idx) => {
        // Check if this schedule contains the section we're updating
        const containsSection = schedule.courses.some((course: Course) => {
          // Find a matching course
          if (course.prefixes[0] === oldData.course.prefixes[0] &&
              course.number === oldData.course.number) {
            // Find a matching section
            return course.sections.some((section: Section) => {
              return section.letter === oldData.section.letter &&
                JSON.stringify(section.term) === JSON.stringify(oldData.section.term) &&
                section.instructors.length === oldData.section.instructors.length &&
                section.instructors.every((i: string) => {
                  return oldData.section.instructors.includes(i);
                });
            });
          }
          return false;
        });

        // Return the schedule index if it contains the section
        if (containsSection) {
          return idx;
        } else {
          return -1;
        }
      }).filter((idx) => {
        return idx !== -1;
      });

      // If no matching schedule found, default to the first active schedule
      if (targetScheduleIds.length === 0 && activeScheduleIds.length > 0) {
        targetScheduleIds = [activeScheduleIds[0]];
      }
    }

    // Only update the target schedules
    targetScheduleIds.forEach(scheduleId => {
      if (scheduleId >= 0 && scheduleId < updatedSchedules.length) {
        // Create a deep copy of the current schedule to modify independently
        const scheduleCopy = JSON.parse(JSON.stringify(updatedSchedules[scheduleId]));

        // Create independent copies of the section and course for each schedule
        const sectionCopy = JSON.parse(JSON.stringify(newSection));
        const courseCopy = JSON.parse(JSON.stringify(newCourse));

        if (removeOldMeeting && oldData) {
          // For updates, explicitly remove the old section first to ensure it's gone
          // Find and remove the old section in this specific schedule copy
          const oldCourse = oldData.course;
          const oldSection = oldData.section;

          if (oldCourse && oldSection) {
            const courseIndex = scheduleCopy.courses.findIndex((c: Course) => {
              return c.prefixes[0] === oldCourse.prefixes[0] && c.number === oldCourse.number;
            });

            if (courseIndex !== -1) {
              const sectionIndex = scheduleCopy.courses[courseIndex].sections.findIndex((s: Section) => {
                return s.letter === oldSection.letter &&
                  JSON.stringify(s.term) === JSON.stringify(oldSection.term) &&
                  s.instructors.length === oldSection.instructors.length &&
                  s.instructors.every((i: string) => {
                    return oldSection.instructors.includes(i);
                  });
              });

              if (sectionIndex !== -1) {
                // Remove the old section entirely
                scheduleCopy.courses[courseIndex].sections.splice(sectionIndex, 1);

                // If no sections left, remove the course too
                if (scheduleCopy.courses[courseIndex].sections.length === 0) {
                  scheduleCopy.courses.splice(courseIndex, 1);
                }
              }
            }
          }
        }

        // Apply updates to this specific schedule copy
        handleOldMeeting(oldData, sectionCopy, courseCopy, removeOldMeeting, scheduleCopy);
        insertSectionCourse(scheduleCopy, sectionCopy, courseCopy, oldData, removeOldMeeting);

        // Preserve the schedule name when updating
        const scheduleName = updatedSchedules[scheduleId].name;
        updatedSchedules[scheduleId] = { ...scheduleCopy, name: scheduleName };
      }
    });

    // Generate the combined display schedule from the updated schedules
    const displaySchedule = combineActiveSchedules(updatedSchedules, activeScheduleIds);

    // Dispatch with all schedule state preserved
    appDispatch({
      payload: {
        activeScheduleIds,
        schedule: displaySchedule,
        schedules: updatedSchedules,
      },
      type: "setScheduleData",
    });
  };

  return { addNonTeachingLoadToSchedule, addSectionToSchedule };
};

const switchToCorrectTerm = async (
  newSection: Section,
  currentTerm: Term,
  appDispatch: React.Dispatch<AppAction> | (() => void),
) => {
  const newTerm = Array.isArray(newSection.term) ? newSection.term[0] : newSection.term;
  if (newTerm !== currentTerm) {
    await appDispatch({
      payload: { selectedTerm: newTerm },
      type: "setSelectedTerm",
    });
  }
};

const scrollToUpdatedSection = (newCourse: Course, newSection: Section) => {
  let className = "";
  let newElement: Element | undefined;
  const newSectionName = `${newCourse.prefixes[0]}-${newCourse.number}-${newSection.letter}`;
  forEach(newSection.instructors, (prof) => {
    forEach(newSection.meetings, (meeting) => {
      const room = `${meeting.location.building}_${meeting.location.roomNumber}`;
      className = createEventClassName(newSectionName, room, prof);
      const newElements = document.getElementsByClassName(className);
      if (newElements) {
        newElement = newElements.item(newElements.length - 1) ?? undefined;
      }
    });
  });
  if (newElement && newElement.parentElement?.parentElement) {
    newElement.scrollIntoView(false);
  }
};

const scrollToUpdatedFacultyRow = (instructor: string) => {
  const id = getIdFromFaculty(instructor);
  const row = document.getElementById(id);
  if (row !== null) {
    row.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};

// a helper to provide consistent naming and retrieve error messages
export const useInput = <T>(label: string, errors: DeepMap<T, FieldError>) => {
  // (temporary?) hack to match new labels to previously used labels
  // if (label === "Delivery Mode") { label = "Instructional Method" }
  if (label === "Course Title") { label = "Name" }
  const name = camelCase(label);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorMessage = (errors[name as keyof T] as any)?.message;
  return { errorMessage, name };
};

export const getIdFromFaculty = (faculty: string) => {
  return faculty.replace(/ /g, "-");
};
