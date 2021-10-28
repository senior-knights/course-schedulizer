import {
  Schedule,
  UpdateNonTeachingLoadModalPagination,
  UpdateSectionModalPagination,
} from "components";
import React, { useContext, useMemo, useRef } from "react";
import { Cell, useTable } from "react-table";
import {
  createTable,
  FacultyRow,
  getCourseSectionMeetingFromCell,
  getEvents,
  getNonTeachingLoadsFromCell,
  UpdateModalPaginationRef,
} from "utilities";
import { AppContext } from "utilities/contexts";
import "./FacultySchedule.scss";

/* Creates a list of Calendars to create the Faculty Schedule
 */
export const FacultySchedule = () => {
  const {
    appState: { professors, schedule },
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

  return (
    <>
      <UpdateSectionModalPagination ref={updateSectionModalRef} />
      <UpdateNonTeachingLoadModalPagination ref={updateNonTeachingLoadModalRef} />

      <Schedule
        calendarHeaders={professors.sort()}
        groupedEvents={getEvents(schedule, "faculty")}
        scheduleType="faculty"
      />
    </>
  );
};
