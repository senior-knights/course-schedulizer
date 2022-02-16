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
import React, { useContext, useMemo } from "react";
import { Column, useSortBy, useTable } from "react-table";
import { ConflictRow } from "utilities";
import { AppContext } from "utilities/contexts";
import "./Conflicts.scss";

export const Conflicts = () => {
  const {
    appState: { schedule },
  } = useContext(AppContext);

  const data = useMemo<ConflictRow[]>(() => {
    return schedule.conflicts || [];
  }, [schedule]);

  const columns = useMemo<Column<ConflictRow>[]>(() => {
    return [
      { Header: "Conflict Type", accessor: "type" },
      { Header: "Instructor 1", accessor: "instructor1" },
      { Header: "Room 1", accessor: "room1" },
      { Header: "Section 1", accessor: "sectionName1" },
      { Header: "Time 1", accessor: "time1" },
      { Header: "Instructor 2", accessor: "instructor2" },
      { Header: "Room 2", accessor: "room2" },
      { Header: "Section 2", accessor: "sectionName2" },
      { Header: "Time 2", accessor: "time2" },
    ];
  }, []);

  // Sort by instructor name by default
  data.sort((a, b): number => {
    if (a.instructor1 < b.instructor1) {
      return -1;
    }
    return 1;
  });

  const tableInstance = useTable({ columns, data }, useSortBy);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  // https://react-table.tanstack.com/docs/quick-start
  return (
    <>
      <div>
        <h3>Conflicts</h3>
      </div>
      <TableContainer component={Paper}>
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
                          // Apply the header cell props, and sort when clicked
                          // See https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/sorting?file=/src/App.js:1439-1662
                          <TableCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                            {
                              // Render the header
                              column.render("Header")
                            }
                            <span>
                              {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                            </span>
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
                const rowId = row.original.instructor1;
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
                            .match(/(Room 1)|(Room 2)/g)
                            ? "change-cursor"
                            : "";
                        return (
                          <TableCell className={cellClass} {...cell.getCellProps()}>
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
