import { camelCase } from "lodash";
import { useContext } from "react";
import { DeepMap, FieldError } from "react-hook-form";
import { insertSectionCourse } from "utilities";
import { AppContext } from "utilities/contexts";
import { Course, CourseSectionMeeting, Meeting, Section } from "utilities/interfaces";
import {
  handleOldMeeting,
  mapInputToInternalTypes,
  NonTeachingLoadInput,
  SectionInput,
} from "utilities/services";
import { mapNonTeachingLoadInput } from "utilities/services/addNonTeachingLoadService";

interface MappedMeeting {
  newCourse: Course;
  newMeeting: Meeting;
  newSection: Section;
}

interface AddToScheduleParams {
  newCourse: Course;
  newMeeting: Meeting;
  newSection: Section;
  oldData: CourseSectionMeeting | undefined;
  removeOldMeeting: boolean;
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
    removeOldMeeting = false,
  ) => {
    setIsCSVLoading(true);
    const { newCourse, newMeeting, newSection }: MappedMeeting = mapInputToInternalTypes(data);
    addToSchedule({ newCourse, newMeeting, newSection, oldData, removeOldMeeting });
  };

  const addNonTeachingLoadToSchedule = (
    data: NonTeachingLoadInput,
    oldData: CourseSectionMeeting | undefined,
    removeOldMeeting = false,
  ) => {
    setIsCSVLoading(true);
    const { newCourse, newMeeting, newSection }: MappedMeeting = mapNonTeachingLoadInput(data);
    addToSchedule({ newCourse, newMeeting, newSection, oldData, removeOldMeeting });
  };

  const addToSchedule = ({
    newCourse,
    newMeeting,
    newSection,
    oldData,
    removeOldMeeting,
  }: AddToScheduleParams) => {
    if (removeOldMeeting) {
      handleOldMeeting(oldData, newMeeting, schedule);
    }
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
