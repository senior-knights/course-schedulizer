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
import { Column, useTable } from "react-table";
import { Schedule, Term } from "../../../utilities/interfaces/dataInterfaces";
import { ScheduleContext } from "../../../utilities/services/context";

interface TableData {
  faculty: string;
  fallCourseSections?: string;
  fallHours?: number;
  loadNotes?: string;
  otherDuties?: string;
  otherHours?: number;
  springCourseSections?: string;
  springHours?: number;
  summerCourseSections?: string;
  summerHours?: number;
  totalHours?: number;
}

const createTable = (schedule: Schedule): TableData[] => {
  const newTableData: TableData[] = [];
  schedule.courses.forEach((course) => {
    course.sections.forEach((section) => {
      section.instructors.forEach((instructor) => {
        const instructorFullName = `${instructor.firstName} ${instructor.lastName}`;
        const sectionName = `${course.prefixes[0]}-${course.number}-${section.letter}`;
        const newDataRow: TableData = {
          faculty: instructorFullName,
        };
        const [oldDataRow] = newTableData.filter((data) => {
          return data.faculty === instructorFullName;
        });
        switch (section.term) {
          case Term.Fall:
            newDataRow.fallCourseSections = oldDataRow?.fallCourseSections
              ? `${oldDataRow.fallCourseSections}, ${sectionName}`
              : sectionName;
            newDataRow.fallHours = oldDataRow?.fallHours
              ? oldDataRow.fallHours + (section.facultyHours || course.facultyHours)
              : section.facultyHours || course.facultyHours;
            break;
          case Term.Spring:
            newDataRow.springCourseSections = oldDataRow?.springCourseSections
              ? `${oldDataRow.springCourseSections}, ${sectionName}`
              : sectionName;
            newDataRow.springHours = oldDataRow?.springHours
              ? oldDataRow.springHours + (section.facultyHours || course.facultyHours)
              : section.facultyHours || course.facultyHours;
            break;
          case Term.Summer:
            newDataRow.summerCourseSections = oldDataRow?.summerCourseSections
              ? `${oldDataRow?.summerCourseSections}, ${sectionName}`
              : sectionName;
            newDataRow.summerHours = oldDataRow?.summerHours
              ? oldDataRow?.summerHours + (section.facultyHours || course.facultyHours)
              : section.facultyHours || course.facultyHours;
            break;
          default:
            break;
        }
        if (oldDataRow) {
          newTableData[newTableData.indexOf(oldDataRow)] = newDataRow;
        } else {
          newTableData.push(newDataRow);
        }
      });
    });
  });
  return newTableData.map((row) => {
    return {
      ...row,
      totalHours: (row.fallHours || 0) + (row.springHours || 0) + (row.summerHours || 0),
    };
  });
};

export const FacultyLoads = () => {
  const { schedule } = useContext(ScheduleContext);

  const data = useMemo<TableData[]>(() => {
    return createTable(schedule);
  }, [schedule]);

  // TODO: Add Other Duties/Hours and Load Notes
  const columns = useMemo<Column<TableData>[]>(() => {
    return [
      { Header: "Faculty", accessor: "faculty" },
      { Header: "Fall Course Sections", accessor: "fallCourseSections" },
      { Header: "Fall Hours", accessor: "fallHours" },
      { Header: "Spring Course Sections", accessor: "springCourseSections" },
      { Header: "Spring Hours", accessor: "springHours" },
      { Header: "Summer Course Sections", accessor: "summerCourseSections" },
      { Header: "Summer Hours", accessor: "summerHours" },
      { Header: "Total Hours", accessor: "totalHours" },
    ];
  }, []);
  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  // https://react-table.tanstack.com/docs/quick-start
  return (
    // apply the table props
    <TableContainer component={Paper}>
      <Table {...getTableProps()}>
        <TableHead>
          {
            // Loop over the header rows
            headerGroups.map((headerGroup) => {
              return (
                // Apply the header row props
                <TableRow {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {
                    // Loop over the headers in each row
                    headerGroup.headers.map((column) => {
                      return (
                        // Apply the header cell props
                        <TableCell {...column.getHeaderProps()} key={column.id}>
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
                <TableRow {...row.getRowProps()} key={row.id}>
                  {
                    // Loop over the rows cells
                    row.cells.map((cell) => {
                      // Apply the cell props
                      return (
                        <TableCell {...cell.getCellProps()} key={cell.value}>
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
  );
};
