/* eslint-disable react/jsx-key */
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { UpdateNonTeachingLoadModalPagination, UpdateSectionModalPagination } from "components";
import React, { useContext, useMemo, useRef } from "react";
import { Cell, Column, useTable } from "react-table";
import {
  createTable,
  FacultyRow,
  getCourseSectionMeetingFromCell,
  getIdFromFaculty,
  getNonTeachingLoadsFromCell,
  UpdateModalPaginationRef,
} from "utilities";
import { AppContext } from "utilities/contexts";
import { AddNonTeachingLoadPopover, PopoverButton } from "../../reuseables";
import "./FacultyLoads.scss";

export const FacultyLoads = () => {
  const {
    appState: { schedule },
  } = useContext(AppContext);

  const data = useMemo<FacultyRow[]>(() => {
    return createTable(schedule);
  }, [schedule]);

  const updateSectionModalRef = useRef<UpdateModalPaginationRef>(null);
  const updateNonTeachingLoadModalRef = useRef<UpdateModalPaginationRef>(null);

  const handleCellClick = (cell: Cell<FacultyRow>) => {
    if (typeof cell.value === "string") {
      const cellHeader = cell.column.Header as string;
      const isNonTeachingLoad = cellHeader === "Other Duties";
      const cellData = isNonTeachingLoad
        ? getNonTeachingLoadsFromCell(schedule, cell.value, cell.row.values.faculty)
        : getCourseSectionMeetingFromCell(schedule, cell.value, cellHeader);
      if (cellData.csm) {
        if (isNonTeachingLoad && updateNonTeachingLoadModalRef.current) {
          updateNonTeachingLoadModalRef.current.handleModalOpen(cellData);
        } else if (!isNonTeachingLoad && updateSectionModalRef.current) {
          updateSectionModalRef.current.handleModalOpen(cellData);
        }
      }
    }
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

  // Sort by faculty name
  data.sort((a, b): number => {
    if (a.faculty < b.faculty) {
      return -1;
    }
    return 1;
  });

  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  // https://react-table.tanstack.com/docs/quick-start
  return (
    <>
      <UpdateSectionModalPagination ref={updateSectionModalRef} />
      <UpdateNonTeachingLoadModalPagination ref={updateNonTeachingLoadModalRef} />
      <TableContainer component={Paper}>
        <div className="add-non-teaching-activity-button">
          <PopoverButton
            buttonTitle="Add Non-Teaching Activity"
            isIcon={false}
            popupId="addNonTeachingActivity"
          >
            <AddNonTeachingLoadPopover />
          </PopoverButton>
        </div>
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
                const rowId = getIdFromFaculty(row.original.faculty);
                return (
                  // Apply the row props
                  <TableRow {...row.getRowProps()} id={rowId}>
                    {
                      // Loop over the rows cells
                      row.cells.map((cell) => {
                        // Apply the cell props
                        const cellClass =
                          cell.value &&
                          cell
                            .getCellProps()
                            .key.toString()
                            .match(/(CourseSections)|(otherDuties)/g)
                            ? "change-cursor"
                            : "";
                        return (
                          <TableCell
                            className={cellClass}
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
