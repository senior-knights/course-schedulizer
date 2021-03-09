import { ModalPagination } from "components";
import { AddNonTeachingLoadPopover } from "components/reuseables";
import React, { forwardRef, Ref } from "react";
import { findNonTeachingLoad, UpdateModalPaginationRef } from "utilities";
import "./UpdateNonTeachingLoadModalPagination.scss";

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
