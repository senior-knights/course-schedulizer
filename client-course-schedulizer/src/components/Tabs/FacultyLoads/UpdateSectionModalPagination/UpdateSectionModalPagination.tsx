import { AddSectionPopover, ModalPagination } from "components";
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
  CourseSectionMeetingTermSections,
  findSection,
  Term,
  UpdateSectionModalPaginationRef,
} from "utilities";
import { AppContext } from "utilities/contexts";
import "./UpdateSectionModalPagination.scss";

interface TermSections {
  sections: string[];
  term: Term;
}

export const UpdateSectionModalPagination = forwardRef(
  (props, ref: Ref<UpdateSectionModalPaginationRef>) => {
    const {
      appState: { schedule },
    } = useContext(AppContext);

    const [open, setOpen] = useState(false);
    const [modalValues, setModalValues] = useState<CourseSectionMeeting>();
    const [sectionNames, setSectionNames] = useState<TermSections>({
      sections: [],
      term: Term.Fall,
    });
    const [page, setPage] = useState(1);

    const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
      setPage(value);
      const courseSectionMeeting = findSection(
        schedule,
        sectionNames.sections[value - 1],
        sectionNames.term,
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

    const handleModalOpen = ({ csm, sectionList, term }: CourseSectionMeetingTermSections) => {
      if (csm) {
        setModalValues(csm);
        setSectionNames({
          sections: sectionList,
          term,
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
        pageCount={sectionNames.sections.length}
      >
        <AddSectionPopover values={modalValues} />
      </ModalPagination>
    );
  },
);
