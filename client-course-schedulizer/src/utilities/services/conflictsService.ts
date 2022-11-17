import { forEach } from "lodash";
import * as AllMoment from "moment";
import moment, { Moment } from "moment";
import { extendMoment } from "moment-range";
import { Day, getLocationString, getSectionName, Schedule, Section } from "utilities";
import { WILDCARD } from "utilities/constants";
import { Instructor } from "utilities/interfaces";

const { range } = extendMoment(AllMoment);

interface ConflictData {
  days: Day[];
  endTime: Moment;
  indexes: number[];
  instructors: Section["instructors"];
  room: string;
  sectionName: string;
  semLength: string;
  startTime: Moment;
  term: Section["term"];
}

export interface ConflictRow {
  instructor1: string;
  instructor2: string;
  room1: string;
  room2: string;
  sectionName1: string;
  sectionName2: string;
  term: string;
  time1: string;
  time2: string;
  type: "Instructor" | "Room" | "Wildcard" | "Constraint";
}

export interface Constraints {
  [key: string]: string[];
}

export const findConflicts = (
  schedule: Schedule,
  constraints: Constraints = { "": [] },
): Schedule => {
  // flatten the schedule into a single array with just the data being checked for conflicts
  const dataToCheck: ConflictData[] = [];
  forEach(schedule.courses, (course, courseIndex) => {
    forEach(course.sections, (section, sectionIndex) => {
      forEach(section.meetings, (meeting, meetingIndex) => {
        meeting.isConflict = false;
        const startTimeMoment = moment(meeting.startTime, "h:mm A");
        dataToCheck.push({
          days: meeting.days,
          endTime: moment(startTimeMoment).add(meeting.duration, "minutes"),
          indexes: [courseIndex, sectionIndex, meetingIndex],
          instructors: section.instructors,
          room: getLocationString(meeting.location),
          sectionName: getSectionName(course, section),
          semLength: section.semesterLength!,
          startTime: startTimeMoment,
          term: section.term,
        });
      });
    });
  });

  const conflictRows: ConflictRow[] = [];
  // loop through each pair of meetings and mark conflicts
  forEach(dataToCheck, (meeting1, i) => {
    forEach(dataToCheck, (meeting2, j) => {
      const conflictRow: ConflictRow = {} as ConflictRow;
      const conflictRow2: ConflictRow = {} as ConflictRow;
      const range1 = range(meeting1.startTime, meeting1.endTime);
      const range2 = range(meeting2.startTime, meeting2.endTime);
      const meeting2IncludesDay = (day: Day) => {
        return meeting2.days.includes(day);
      };
      const meeting2IncludesInstructor = (instructor: Instructor) => {
        const value = meeting2.instructors.includes(instructor);
        if (value) {
          if (meetingRoomConflict()) {
            // Right now only checking here, if we add these sort of ifs to the other type checkers, guard against infinite looping calls!
            // If this is also true, we need an additional row
            conflictRow2.type = "Room";
            assignRowValues(conflictRow2);
            if (checkDupeSwitched(conflictRow2)) {
              conflictRows.push(conflictRow2);
            }
          }
          conflictRow.type = "Instructor";
        }
        return value;
      };
      const meeting2IncludesConstriant = () => {
        const value =
          constraints[meeting1.sectionName.replace("-", "").slice(0, -2)] !== undefined
            ? constraints[meeting1.sectionName.replace("-", "").slice(0, -2)].includes(
                meeting2.sectionName.replace("-", "").slice(0, -2),
              )
            : false;
        if (value) {
          conflictRow.type = "Constraint";
        }
        return value;
      };
      const meeting1IncludesWildcard = () => {
        const value = meeting1.instructors.includes(WILDCARD);
        if (value) {
          conflictRow.type = "Wildcard";
        }
        return value;
      };
      const meetingRoomConflict = () => {
        const value =
          meeting1.room === meeting2.room && meeting1.sectionName !== meeting2.sectionName;
        if (value) {
          conflictRow.type = "Room";
        }
        return value;
      };
      const assignRowValues = (myRow: ConflictRow) => {
        myRow.instructor1 = meeting1.instructors.join("");
        myRow.instructor2 = meeting2.instructors.join("");
        myRow.room1 = meeting1.room;
        myRow.room2 = meeting2.room;
        myRow.sectionName1 = meeting1.sectionName;
        myRow.sectionName2 = meeting2.sectionName;
        myRow.term = meeting1.term.toString();
        myRow.time1 = `${meeting1.startTime.format("h:mm A")} - ${meeting1.endTime.format(
          "h:mm A",
        )}`;
        myRow.time2 = `${meeting2.startTime.format("h:mm A")} - ${meeting2.endTime.format(
          "h:mm A",
        )}`;
      };
      const checkDupeSwitched = (myRow: ConflictRow) => {
        // Checking for a switched-order duplicate before pushing
        let temp = true;
        forEach(conflictRows, (aConflict) => {
          if (
            aConflict.instructor1 === conflictRow.instructor2 &&
            aConflict.instructor2 === conflictRow.instructor1 &&
            aConflict.room1 === conflictRow.room2 &&
            aConflict.room2 === conflictRow.room1 &&
            aConflict.sectionName1 === conflictRow.sectionName2 &&
            aConflict.sectionName2 === conflictRow.sectionName1 &&
            aConflict.term === conflictRow.term &&
            aConflict.type === conflictRow.type
          ) {
            temp = false;
          }
        });
        return temp;
      };

      if (
        i !== j &&
        range1.overlaps(range2) &&
        meeting1.term === meeting2.term &&
        meeting1.semLength === meeting2.semLength &&
        meeting1.days.some(meeting2IncludesDay) &&
        (meeting1.instructors.some(meeting2IncludesInstructor) ||
          meeting2IncludesConstriant() ||
          meeting1IncludesWildcard() ||
          meetingRoomConflict())
      ) {
        const [ci1, si1, mi1] = meeting1.indexes;
        const [ci2, si2, mi2] = meeting2.indexes;
        schedule.courses[ci1].sections[si1].meetings[mi1].isConflict = true;
        schedule.courses[ci2].sections[si2].meetings[mi2].isConflict = true;

        assignRowValues(conflictRow);
        if (checkDupeSwitched(conflictRow)) {
          conflictRows.push(conflictRow);
        }
      }
    });
  });
  schedule.conflicts = conflictRows;
  return schedule;
};
