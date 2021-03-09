import { AddSectionPopover, ModalPagination } from "components";
import React, { forwardRef, Ref } from "react";
import { CourseSectionMeeting, findSection, Schedule, UpdateModalPaginationRef } from "utilities";
import "./UpdateSectionModalPagination.scss";

export const UpdateSectionModalPagination = forwardRef(
  (props, ref: Ref<UpdateModalPaginationRef>) => {
    return (
      <ModalPagination
        ref={ref}
        findCourseSectionMeeting={
          findSection as (
            schedule: Schedule,
            sectionName: string,
            term: string,
          ) => CourseSectionMeeting | null
        }
        PopoverComponent={AddSectionPopover}
      />
    );
  },
);

UpdateSectionModalPagination.displayName = "UpdateSectionModalPagination";
