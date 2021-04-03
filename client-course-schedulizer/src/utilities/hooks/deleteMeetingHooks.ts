import { useContext } from "react";
import { AppContext } from "utilities/contexts";
import { CourseSectionMeeting } from "utilities/interfaces";
import { removeMeetingFromSchedule } from "utilities/services";

export const useDeleteMeetingFromSchedule = () => {
  const {
    appState: { schedule },
    appDispatch,
    setIsCSVLoading,
  } = useContext(AppContext);

  // Update the schedule via pass by sharing.
  const deleteMeetingFromSchedule = (data: CourseSectionMeeting | undefined) => {
    const meeting = data?.meeting;
    setIsCSVLoading(true);
    removeMeetingFromSchedule(data, schedule, meeting);
    appDispatch({ payload: { schedule }, type: "setScheduleData" });
    setIsCSVLoading(false);
  };

  return { deleteMeetingFromSchedule };
};
