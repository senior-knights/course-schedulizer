import { Modal, Paper } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import React, { ChangeEvent, PropsWithChildren } from "react";
import "./ModalPagination.scss";

interface ModalPagination extends PropsWithChildren<{}> {
  onClose: () => void;
  onPageChange: (event: ChangeEvent<unknown>, value: number) => void;
  open: boolean;
  page: number;
  pageCount: number;
}

export const ModalPagination = (props: ModalPagination) => {
  const { children, onClose, onPageChange, open, page, pageCount } = props;
  return (
    <Modal className="add-section-modal" onClose={onClose} open={open}>
      <Paper className="add-section-modal-paper">
        <Pagination count={pageCount} onChange={onPageChange} page={page} />
        {children}
      </Paper>
    </Modal>
  );
};
