import { ModalPagination } from "components";
import { AddNonTeachingLoadPopover } from "components/reuseables";
import React, {
  ChangeEvent,
  forwardRef,
  Ref,
  useContext,
  useImperativeHandle,
  useState,
} from "react";
import {
  CourseSectionMeeting,
  CourseSectionMeetingInstructorNonTeachingLoads,
  findNonTeachingLoad,
  Instructor,
  UpdateNonTeachingLoadModalPaginationRef,
} from "utilities";
import { AppContext } from "utilities/contexts";
import "./UpdateNonTeachingLoadModalPagination.scss";

interface InstructorNonTeachingLoads {
  instructor: Instructor;
  nonTeachingLoads: string[];
}

export const UpdateNonTeachingLoadModalPagination = forwardRef(
  (props, ref: Ref<UpdateNonTeachingLoadModalPaginationRef>) => {
    const {
      appState: { schedule },
    } = useContext(AppContext);

    const [open, setOpen] = useState(false);
    const [modalValues, setModalValues] = useState<CourseSectionMeeting>();
    const [instructorNonTeachingLoads, setInstructorNonTeachingLoads] = useState<
      InstructorNonTeachingLoads
    >({
      instructor: "",
      nonTeachingLoads: [],
    });
    const [page, setPage] = useState(1);
    const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
      setPage(value);
      const courseSectionMeeting = findNonTeachingLoad(
        schedule,
        instructorNonTeachingLoads.nonTeachingLoads[value - 1],
        instructorNonTeachingLoads.instructor,
      );
      if (courseSectionMeeting !== null) {
        setOpen(false);
        setModalValues(courseSectionMeeting);
        setOpen(true);
      }
    };

    const handleModalClose = () => {
      setPage(1);
      setOpen(false);
    };

    const handleModalOpen = ({
      csm,
      nonTeachingLoads,
      instructor,
    }: CourseSectionMeetingInstructorNonTeachingLoads) => {
      if (csm) {
        setModalValues(csm);
        setInstructorNonTeachingLoads({
          instructor,
          nonTeachingLoads,
        });
        setOpen(true);
      }
    };

    useImperativeHandle(ref, () => {
      return {
        handleModalOpen,
      };
    });

    return (
      <ModalPagination
        onClose={handleModalClose}
        onPageChange={handlePageChange}
        open={open}
        page={page}
        pageCount={instructorNonTeachingLoads.nonTeachingLoads.length}
      >
        <AddNonTeachingLoadPopover values={modalValues} />
      </ModalPagination>
    );
  },
);
