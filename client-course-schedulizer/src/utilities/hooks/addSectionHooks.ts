import { camelCase, forEach } from "lodash";
import { useContext } from "react";
import { DeepMap, FieldError } from "react-hook-form";
import { insertSectionCourse } from "utilities";
import { AppContext } from "utilities/contexts";
import { AppAction, Course, CourseSectionMeeting, Section, Term } from "utilities/interfaces";
import {
  createEventClassName,
  handleOldSection,
  mapInputToInternalTypes,
  NonTeachingLoadInput,
  SectionInput,
} from "utilities/services";
import { mapNonTeachingLoadInput } from "utilities/services/addNonTeachingLoadService";

interface MappedSection {
  newCourse: Course;
  newSection: Section;
}

export const useAddSectionToSchedule = () => {
  const {
    appState: { schedule, selectedTerm },
    appDispatch,
    setIsCSVLoading,
  } = useContext(AppContext);

  // Update the schedule via pass by sharing.
  const addSectionToSchedule = async (
    data: SectionInput,
    oldData: CourseSectionMeeting | undefined,
    removeOldSection = false,
  ) => {
    setIsCSVLoading(true);
    const { newSection, newCourse }: MappedSection = mapInputToInternalTypes(data);
    handleOldSection(oldData, newSection, removeOldSection, schedule);
    insertSectionCourse(schedule, newSection, newCourse);
    appDispatch({ payload: { schedule }, type: "setScheduleData" });
    // TODO: Ensure scroll doesn't cause graphical errors
    // TODO: What about adding/modifying a section on the teaching loads tab once merged?
    await switchToCorrectTerm(newSection, selectedTerm, appDispatch);
    setIsCSVLoading(false);
    scrollToUpdatedSection(newCourse, newSection);
  };

  const addNonTeachingLoadToSchedule = (data: NonTeachingLoadInput) => {
    setIsCSVLoading(true);
    const { newSection, newCourse }: MappedSection = mapNonTeachingLoadInput(data);
    // handleOldSection(oldData, newSection, removeOldSection, schedule);
    insertSectionCourse(schedule, newSection, newCourse);
    appDispatch({ payload: { schedule }, type: "setScheduleData" });
    setIsCSVLoading(false);
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
      payload: { term: newTerm },
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
  if (newElement) {
    newElement.scrollIntoView({ behavior: "smooth", inline: "nearest" });
  }
};

// a helper to provide consistent naming and retrieve error messages
export const useInput = <T>(label: string, errors: DeepMap<T, FieldError>) => {
  const name = camelCase(label);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorMessage = (errors[name as keyof T] as any)?.message;
  return { errorMessage, name };
};
