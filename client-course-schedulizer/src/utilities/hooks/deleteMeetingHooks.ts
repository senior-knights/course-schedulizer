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
    const section = data?.section;
    const course = data?.course;
    setIsCSVLoading(true);
    removeMeetingFromSchedule(data, schedule, meeting, section, course);
    appDispatch({ payload: { schedule }, type: "setScheduleData" });
    setIsCSVLoading(false);
  };

  return { deleteMeetingFromSchedule };
};
