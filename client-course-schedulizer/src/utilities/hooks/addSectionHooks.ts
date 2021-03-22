import { camelCase } from "lodash";
import { useContext } from "react";
import { DeepMap, FieldError } from "react-hook-form";
import { insertSectionCourse } from "utilities";
import { AppContext } from "utilities/contexts";
import { Course, CourseSectionMeeting, Section } from "utilities/interfaces";
import {
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

interface AddToScheduleParams {
  newCourse: Course;
  newSection: Section;
  oldData: CourseSectionMeeting | undefined;
  removeOldSection: boolean;
}

export const useAddSectionToSchedule = () => {
  const {
    appState: { schedule },
    appDispatch,
    setIsCSVLoading,
  } = useContext(AppContext);

  // Update the schedule via pass by sharing.
  const addSectionToSchedule = (
    data: SectionInput,
    oldData: CourseSectionMeeting | undefined,
    removeOldSection = false,
  ) => {
    setIsCSVLoading(true);
    const { newSection, newCourse }: MappedSection = mapInputToInternalTypes(data);
    addToSchedule({ newCourse, newSection, oldData, removeOldSection });
  };

  const addNonTeachingLoadToSchedule = (
    data: NonTeachingLoadInput,
    oldData: CourseSectionMeeting | undefined,
    removeOldSection = false,
  ) => {
    setIsCSVLoading(true);
    const { newSection, newCourse }: MappedSection = mapNonTeachingLoadInput(data);
    addToSchedule({ newCourse, newSection, oldData, removeOldSection });
  };

  const addToSchedule = ({
    newCourse,
    newSection,
    oldData,
    removeOldSection,
  }: AddToScheduleParams) => {
    console.log(newSection.instructors);
    handleOldSection(oldData, newSection, removeOldSection, schedule);
    insertSectionCourse(schedule, newSection, newCourse);
    appDispatch({ payload: { schedule }, type: "setScheduleData" });
    setIsCSVLoading(false);
  };

  return { addNonTeachingLoadToSchedule, addSectionToSchedule };
};

// a helper to provide consistent naming and retrieve error messages
export const useInput = <T>(label: string, errors: DeepMap<T, FieldError>) => {
  const name = camelCase(label);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorMessage = (errors[name as keyof T] as any)?.message;
  return { errorMessage, name };
};
