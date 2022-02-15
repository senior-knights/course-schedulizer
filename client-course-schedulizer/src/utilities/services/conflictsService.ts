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
  time1: string;
  time2: string;
}

export interface Constraints {
    [key: string]: string[]
}

export const findConflicts = (schedule: Schedule, constraints: Constraints = {"": []}): Schedule => {
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
      const range1 = range(meeting1.startTime, meeting1.endTime);
      const range2 = range(meeting2.startTime, meeting2.endTime);
      const meeting2IncludesDay = (day: Day) => {
        return meeting2.days.includes(day);
      };
      const meeting2IncludesInstructor = (instructor: Instructor) => {
        return meeting2.instructors.includes(instructor);
      };
      const meeting2IncludesConstriant = () => {
        return constraints[meeting1.sectionName.replace("-", "").slice(0, -2)].includes(meeting2.sectionName.replace("-", "").slice(0, -2));
      };

      if (
        i !== j &&
        range1.overlaps(range2) &&
        meeting1.term === meeting2.term &&
        meeting1.days.some(meeting2IncludesDay) &&
        (meeting1.instructors.some(meeting2IncludesInstructor) ||
          constraints[meeting1.sectionName.replace("-", "").slice(0, -2)] !== undefined ? meeting2IncludesConstriant() : false ||
          meeting1.instructors.includes(WILDCARD) ||
          (meeting1.room === meeting2.room && meeting1.sectionName !== meeting2.sectionName))
        ) {
        // console.log(meeting1);
        // console.log(meeting2);
        // console.log(constraints[meeting1.sectionName.replace("-", "").slice(0, -2)].includes(meeting2.sectionName.replace("-", "").slice(0, -2)));
        // console.log(meeting1.sectionName.replace("-", "").slice(0, -2));
        // console.log(meeting2.sectionName.replace("-", "").slice(0, -2));
        // console.log(constraints[meeting1.sectionName.replace("-", "").slice(0, -2)] !== undefined ? meeting2IncludesConstriant : false);
        // console.log(meeting2IncludesConstriant);
        // TODO: Get rid of these comments
        // (range1.overlaps(range2) && (constraints[meeting1.sectionName.replace("-", "").slice(0, -2)] !== undefined ? constraints[meeting1.sectionName.replace("-", "").slice(0, -2)].includes(meeting2.sectionName.replace("-", "").slice(0, -2)) : false)) ||
        // (constraints[meeting1.sectionName.replace("-", "").slice(0, -2)] !== undefined ? constraints[meeting1.sectionName.replace("-", "").slice(0, -2)].includes(meeting2.sectionName.replace("-", "").slice(0, -2)) : false))) &&
        // constraints[meeting1.sectionName.replace("-", "").slice(0, -2)] !== undefined ? constraints[meeting1.sectionName.replace("-", "").slice(0, -2)].includes(meeting2.sectionName.replace("-", "").slice(0, -2) as string) : false
        // constraints !== undefined &&
        // !constraints[meeting1.sectionName.replace("-", "").slice(0, -2) as string].includes(meeting2.sectionName.replace("-", "").slice(0, -2) as string)
        // meeting1.sectionName.replace("-", "").slice(0, -2) as string
        // console.log(meeting1.sectionName); 
        // console.log(constraints[meeting1.sectionName.replace("-", "").slice(0, -2)] !== undefined ? constraints[meeting1.sectionName.replace("-", "").slice(0, -2)] : false );
        // console.log(constraints[meeting1.sectionName.replace("-", "").slice(0, -2)].includes(meeting2.sectionName.replace("-", "").slice(0, -2) as string))
        // console.log(constraints);
        // console.log(range1.overlaps(range2));
        // console.log(constraints[meeting1.sectionName.replace("-", "").slice(0, -2)] !== undefined ? constraints[meeting1.sectionName.replace("-", "").slice(0, -2)].includes(meeting2.sectionName.replace("-", "").slice(0, -2) as string) : false)
        
        const [ci1, si1, mi1] = meeting1.indexes;
        const [ci2, si2, mi2] = meeting2.indexes;
        schedule.courses[ci1].sections[si1].meetings[mi1].isConflict = true;
        schedule.courses[ci2].sections[si2].meetings[mi2].isConflict = true;

        conflictRow.instructor1 = meeting1.instructors.join("");
        conflictRow.instructor2 = meeting2.instructors.join("");
        conflictRow.room1 = meeting1.room;
        conflictRow.room2 = meeting2.room;
        conflictRow.sectionName1 = meeting1.sectionName;
        conflictRow.sectionName2 = meeting2.sectionName;
        conflictRow.time1 = `${meeting1.startTime.format("h:mm A")} - ${meeting1.endTime.format(
          "h:mm A",
        )}`;
        conflictRow.time2 = `${meeting2.startTime.format("h:mm A")} - ${meeting2.endTime.format(
          "h:mm A",
        )}`;
        conflictRows.push(conflictRow);
      }
    });
  });
  schedule.conflicts = conflictRows;
  return schedule;
};
