import { useContext } from "react";
import { AppContext } from "utilities/contexts";
import { Course, CourseSectionMeeting, Meeting, Section } from "utilities/interfaces";
import { removeMeetingFromSchedule } from "utilities/services";
import { combineActiveSchedules } from "utilities/reducers/appReducer";
import { indexOf } from "lodash";

export const useDeleteMeetingFromSchedule = () => {
  const {
    appState: { schedules, activeScheduleIds },
    appDispatch,
    setIsCSVLoading,
  } = useContext(AppContext);

  // Update the schedule via pass by sharing.
  const deleteMeetingFromSchedule = (data: CourseSectionMeeting | undefined) => {
    const meeting = data?.meeting;
    const section = data?.section;
    const course = data?.course;
    setIsCSVLoading(true);

    // Create a copy of the schedules array
    const updatedSchedules = [...schedules];

    // IMPORTANT: Only target active schedules, regardless of which schedules contain the section
    // This ensures we only modify visible schedules
    let targetScheduleIds: number[] = [...activeScheduleIds];

    // Only update the target schedules
    targetScheduleIds.forEach(scheduleId => {
      if (scheduleId >= 0 && scheduleId < updatedSchedules.length) {
        // Create a deep copy of the current schedule to modify independently
        const scheduleCopy = JSON.parse(JSON.stringify(updatedSchedules[scheduleId]));

        // Apply deletion to this specific schedule copy
        if (data?.course && data?.section && data?.meeting) {
          // Find the course, section, and meeting in the schedule copy by properties
          const courseIndex = scheduleCopy.courses.findIndex((c: Course) => {
            return c.prefixes[0] === data.course.prefixes[0] &&
                   c.number === data.course.number;
          });

          if (courseIndex !== -1) {
            const sectionIndex = scheduleCopy.courses[courseIndex].sections.findIndex((s: Section) => {
              return s.letter === data.section.letter &&
                    JSON.stringify(s.term) === JSON.stringify(data.section.term) &&
                    s.instructors.length === data.section.instructors.length &&
                    s.instructors.every((i: string) => {
                      return data.section.instructors.includes(i);
                    });
            });

            if (sectionIndex !== -1) {
              const meetingIndex = scheduleCopy.courses[courseIndex].sections[sectionIndex].meetings.findIndex((m: Meeting) => {
                return m.startTime === data.meeting.startTime &&
                       m.duration === data.meeting.duration &&
                       JSON.stringify(m.days) === JSON.stringify(data.meeting.days) &&
                       m.location.building === data.meeting.location.building &&
                       m.location.roomNumber === data.meeting.location.roomNumber;
              });

              if (meetingIndex !== -1) {
                // Remove the meeting directly
                const oldSectionHadMeetings = scheduleCopy.courses[courseIndex].sections[sectionIndex].meetings.length > 0;

                // Remove the meeting
                scheduleCopy.courses[courseIndex].sections[sectionIndex].meetings.splice(meetingIndex, 1);

                // If no meetings left, remove the section
                if (scheduleCopy.courses[courseIndex].sections[sectionIndex].meetings.length === 0) {
                  scheduleCopy.courses[courseIndex].sections.splice(sectionIndex, 1);

                  // If no sections left, remove the course
                  if (scheduleCopy.courses[courseIndex].sections.length === 0) {
                    scheduleCopy.courses.splice(courseIndex, 1);
                  }
                }
              }
            }
          }
        }

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

    setIsCSVLoading(false);
  };

  return { deleteMeetingFromSchedule };
};
