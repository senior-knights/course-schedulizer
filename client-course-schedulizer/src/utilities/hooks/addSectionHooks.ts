import { camelCase } from "lodash";
import { useContext } from "react";
import { DeepMap, FieldError } from "react-hook-form";
import { insertSectionCourse } from "utilities";
import { AppContext } from "utilities/contexts";
import { Course, CourseSectionMeeting, Section } from "utilities/interfaces";
import { handleOldSection, mapInputToInternalTypes, SectionInput } from "utilities/services";

interface MappedSection {
  newCourse: Course;
  newSection: Section;
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
    handleOldSection(oldData, newSection, removeOldSection, schedule);
    insertSectionCourse(schedule, newSection, newCourse);
    appDispatch({ payload: { schedule }, type: "setScheduleData" });
    setIsCSVLoading(false);
  };

  return { addSectionToSchedule };
};

// a helper to provide consistent naming and retrieve error messages
export const useInput = <T>(label: string, errors: DeepMap<T, FieldError>) => {
  const name = camelCase(label);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorMessage = (errors[name as keyof T] as any)?.message;
  return { errorMessage, name };
};