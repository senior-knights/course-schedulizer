/* eslint-disable react/jsx-key */
import {
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import React, { ChangeEvent, useContext, useMemo, useState } from "react";
import { Cell, Column, useTable } from "react-table";
import { CourseSectionMeeting, createTable, FacultyRow, findSection, Term } from "utilities";
import { AppContext } from "utilities/contexts";
import { AddNonTeachingLoadPopover, AddSectionPopover, PopoverButton } from "../../reuseables";
import "./FacultyLoads.scss";

interface TermSections {
  sections: string[];
  term: Term;
}

export const FacultyLoads = () => {
  const {
    appState: { schedule },
  } = useContext(AppContext);

  const data = useMemo<FacultyRow[]>(() => {
    return createTable(schedule);
  }, [schedule]);

  const [open, setOpen] = useState(false);
  const [modalValues, setModalValues] = useState<CourseSectionMeeting>();
  const [sectionNames, setSectionNames] = useState<TermSections>({ sections: [], term: Term.Fall });
  const [page, setPage] = React.useState(1);

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

  const handleCellClick = (cell: Cell<FacultyRow>) => {
    if (typeof cell.value === "string") {
      const sectionStrList = cell.value.split(", ");
      const courseSectionHeaders = [
        "Fall Course Sections",
        "Spring Course Sections",
        "Summer Course Sections",
      ];
      if (courseSectionHeaders.includes(cell.column.Header as string)) {
        let term: Term = Term.Fall;
        switch (cell.column.Header) {
          case "Fall Course Sections":
            term = Term.Fall;
            break;
          case "Spring Course Sections":
            term = Term.Spring;
            break;
          case "Summer Course Sections":
            term = Term.Summer;
            break;
          default:
            break;
        }
        let courseSectionMeeting = findSection(schedule, sectionStrList[0], term);
        if (courseSectionMeeting === null) {
          term = Term.Interim;
          courseSectionMeeting = findSection(schedule, sectionStrList[0], Term.Interim);
        }
        if (courseSectionMeeting !== null) {
          setModalValues(courseSectionMeeting);
          setSectionNames({
            sections: sectionStrList,
            term,
          });
          setOpen(true);
        }
      }
    }
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const columns = useMemo<Column<FacultyRow>[]>(() => {
    return [
      { Header: "Faculty", accessor: "faculty" },
      { Header: "Total Hours", accessor: "totalHours" },
      { Header: "Fall Course Sections", accessor: "fallCourseSections" },
      { Header: "Fall Hours", accessor: "fallHours" },
      { Header: "Spring Course Sections", accessor: "springCourseSections" },
      { Header: "Spring Hours", accessor: "springHours" },
      { Header: "Summer Course Sections", accessor: "summerCourseSections" },
      { Header: "Summer Hours", accessor: "summerHours" },
      { Header: "Other Duties", accessor: "otherDuties" },
      { Header: "Other Hours", accessor: "otherHours" },
    ];
  }, []);
  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  // https://react-table.tanstack.com/docs/quick-start
  return (
    <>
      <Modal className="add-section-modal" onClose={handleModalClose} open={open}>
        <Paper className="add-section-modal-paper">
          <Pagination
            count={sectionNames.sections.length}
            onChange={handlePageChange}
            page={page}
          />
          <AddSectionPopover values={modalValues} />
        </Paper>
      </Modal>
      <TableContainer component={Paper}>
        <PopoverButton buttonTitle="Add Non-Teaching Load" popupId="addNonTeachingLoad">
          <AddNonTeachingLoadPopover />
        </PopoverButton>
        <Table {...getTableProps()}>
          <TableHead>
            {
              // Loop over the header rows
              headerGroups.map((headerGroup) => {
                return (
                  // Apply the header row props
                  <TableRow {...headerGroup.getHeaderGroupProps()}>
                    {
                      // Loop over the headers in each row
                      headerGroup.headers.map((column) => {
                        return (
                          // Apply the header cell props
                          <TableCell {...column.getHeaderProps()}>
                            {
                              // Render the header
                              column.render("Header")
                            }
                          </TableCell>
                        );
                      })
                    }
                  </TableRow>
                );
              })
            }
          </TableHead>
          {/* Apply the table body props */}
          <TableBody {...getTableBodyProps()}>
            {
              // Loop over the table rows
              rows.map((row) => {
                // Prepare the row for display
                prepareRow(row);
                return (
                  // Apply the row props
                  <TableRow {...row.getRowProps()}>
                    {
                      // Loop over the rows cells
                      row.cells.map((cell) => {
                        // Apply the cell props
                        return (
                          <TableCell
                            {...cell.getCellProps()}
                            onClick={() => {
                              handleCellClick(cell);
                            }}
                          >
                            {
                              // Render the cell contents
                              cell.render("Cell")
                            }
                          </TableCell>
                        );
                      })
                    }
                  </TableRow>
                );
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
