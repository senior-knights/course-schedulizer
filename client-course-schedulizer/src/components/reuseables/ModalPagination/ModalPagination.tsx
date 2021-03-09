import { Modal, Paper } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
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
  CSMIterableKeyMap,
  FindCourseSectionMeetingFunction,
  PopoverValueProps,
  UpdateModalPaginationRef,
} from "utilities";
import { AppContext } from "utilities/contexts";
import "./ModalPagination.scss";

interface ModalPaginationProps {
  /**
   * A component that displays a form to edit the entries
   * @type {React.ElementType<PopoverValueProps>}
   * @memberof ModalPaginationProps
   */
  PopoverComponent: React.ElementType<PopoverValueProps>;
  /**
   * Function to find specific CSMs for the specific cell clicked
   * @type {FindCourseSectionMeetingFunction}
   * @memberof ModalPaginationProps
   */
  findCourseSectionMeeting: FindCourseSectionMeetingFunction;
}

interface IterableKeyMap {
  iterable: string[];
  key: string;
}

/**
 * Creates a modal for forms with multiple pages and allows the user to
 *   step through the pages and edit the same form for multiple entities.
 * Used on the FacultyPage to find CourseSectionMeetings
 */
export const ModalPagination = forwardRef(
  (props: ModalPaginationProps, ref: Ref<UpdateModalPaginationRef>) => {
    const { findCourseSectionMeeting, PopoverComponent } = props;

    const {
      appState: { schedule },
    } = useContext(AppContext);

    const [open, setOpen] = useState(false);
    const [modalValues, setModalValues] = useState<CourseSectionMeeting>();
    const [iterableKeyMap, setIterableKeyMap] = useState<IterableKeyMap>({
      iterable: [],
      key: "",
    });
    const [page, setPage] = useState(1);

    const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
      setPage(value);
      const courseSectionMeeting = findCourseSectionMeeting(
        schedule,
        iterableKeyMap.iterable[value - 1],
        iterableKeyMap.key,
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

    const handleModalOpen = ({ csm, iterable, key }: CSMIterableKeyMap) => {
      if (csm) {
        setModalValues(csm);
        setIterableKeyMap({
          iterable,
          key,
        });
      }
      setOpen(true);
    };

    // Allow parents to open the child modal.
    useImperativeHandle(ref, () => {
      return {
        handleModalOpen,
      };
    });

    return (
      <Modal className="pagination-modal" onClose={handleModalClose} open={open}>
        <Paper className="pagination-modal-paper">
          <Pagination
            count={iterableKeyMap.iterable.length}
            onChange={handlePageChange}
            page={page}
          />
          <PopoverComponent values={modalValues} />
        </Paper>
      </Modal>
    );
  },
);
