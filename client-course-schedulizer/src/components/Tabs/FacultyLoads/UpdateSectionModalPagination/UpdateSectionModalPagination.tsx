import { AddSectionPopover, ModalPagination } from "components";
import React, { forwardRef, Ref } from "react";
import { FindCourseSectionMeetingFunction, findSection, UpdateModalPaginationRef } from "utilities";
import "./UpdateSectionModalPagination.scss";

/**
 * Creates a popup modal used on the FacultyLoads page to find
 *   courses and allow the user to page through and edit them
 *   on a modal.
 */
export const UpdateSectionModalPagination = forwardRef(
  (props, ref: Ref<UpdateModalPaginationRef>) => {
    return (
      <ModalPagination
        ref={ref}
        findCourseSectionMeeting={findSection as FindCourseSectionMeetingFunction}
        PopoverComponent={AddSectionPopover}
      />
    );
  },
);

UpdateSectionModalPagination.displayName = "UpdateSectionModalPagination";
