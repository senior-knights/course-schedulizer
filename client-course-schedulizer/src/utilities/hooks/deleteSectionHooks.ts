import { useContext } from "react";
import { AppContext } from "utilities/contexts";
import { CourseSectionMeeting } from "utilities/interfaces";
import { removeSectionFromSchedule } from "utilities/services";

export const useDeleteSectionFromSchedule = () => {
  const {
    appState: { schedule },
    appDispatch,
    setIsCSVLoading,
  } = useContext(AppContext);

  // Update the schedule via pass by sharing.
  const deleteSectionFromSchedule = (data: CourseSectionMeeting | undefined) => {
    const section = data?.section;
    if (section) {
      setIsCSVLoading(true);
      removeSectionFromSchedule(data, schedule, section);
      appDispatch({ payload: { schedule }, type: "setScheduleData" });
      setIsCSVLoading(false);
    }
  };

  return { deleteSectionFromSchedule };
};
