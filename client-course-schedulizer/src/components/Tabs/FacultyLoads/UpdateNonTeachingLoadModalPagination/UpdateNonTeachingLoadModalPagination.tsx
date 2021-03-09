import { ModalPagination } from "components";
import { AddNonTeachingLoadPopover } from "components/reuseables";
import React, { forwardRef, Ref } from "react";
import { findNonTeachingLoad, UpdateModalPaginationRef } from "utilities";
import "./UpdateNonTeachingLoadModalPagination.scss";

/**
 * Creates a popup modal used on the FacultyLoads page to find
 *   non-teaching loads and allow the user to page through and edit them
 *   on a modal.
 */
export const UpdateNonTeachingLoadModalPagination = forwardRef(
  (props, ref: Ref<UpdateModalPaginationRef>) => {
    return (
      <ModalPagination
        ref={ref}
        findCourseSectionMeeting={findNonTeachingLoad}
        PopoverComponent={AddNonTeachingLoadPopover}
      />
    );
  },
);

UpdateNonTeachingLoadModalPagination.displayName = "UpdateNonTeachingLoadModalPagination";
