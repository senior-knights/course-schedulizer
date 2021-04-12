import { camelCase, cloneDeep, forEach, isEqual, omit } from "lodash";
import moment from "moment";
import { useContext } from "react";
import { DeepMap, FieldError } from "react-hook-form";
import { insertSectionCourse } from "utilities";
import { AppContext } from "utilities/contexts";
import {
  AppAction,
  Course,
  CourseSectionMeeting,
  SchedulizerTab,
  Section,
  Term,
} from "utilities/interfaces";
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
    appState: { schedule, selectedTerm, schedulizerTab },
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
    let newMeeting;
    if (newSection.meetings.length) {
      [newMeeting] = newSection.meetings;
    }
    newSection.startDate = oldData?.section.startDate ?? "";
    newSection.termStart = oldData?.section.termStart ?? "";
    newSection.endDate = oldData?.section.endDate ?? "";
    const oldDataCopy = cloneDeep(oldData);
    newSection.timestamp = oldDataCopy?.section.timestamp;
    if (
      !(
        isEqual(
          omit(newSection, ["timestamp", "meetings"]),
          omit(oldDataCopy?.section, ["timestamp", "meetings"]),
        ) &&
        isEqual(omit(newCourse, "sections"), omit(oldDataCopy?.course, "sections")) &&
        isEqual(omit(newMeeting, "isConflict"), omit(oldDataCopy?.meeting, "isConflict"))
      )
    ) {
      newSection.timestamp = moment().format();
    }

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
    handleOldMeeting(oldData, newSection, removeOldMeeting, schedule);
    insertSectionCourse(schedule, newSection, newCourse);
    appDispatch({ payload: { schedule }, type: "setScheduleData" });
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
  const name = camelCase(label);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorMessage = (errors[name as keyof T] as any)?.message;
  return { errorMessage, name };
};

export const getIdFromFaculty = (faculty: string) => {
  return faculty.replace(/ /g, "-");
};
