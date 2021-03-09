import { CourseSectionMeeting, Schedule } from "utilities";

/**
 * Popover's with a form that are used to edit a specific
 * course-section's meeting.
 *
 * @export
 * @interface PopoverValueProps
 */
export interface PopoverValueProps {
  values?: CourseSectionMeeting;
}

/**
 * Function signature for finding a course section meeting.
 *
 * @export
 * @type
 */
export type FindCourseSectionMeetingFunction = (
  schedule: Schedule,
  iterableItem: string,
  key: string,
) => CourseSectionMeeting | null;
