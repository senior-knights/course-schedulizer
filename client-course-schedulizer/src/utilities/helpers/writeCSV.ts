import * as di from "../interfaces/dataInterfaces";

const convertFromInterface = function convertFromInterface(schedule: di.Schedule): string {
  let csvStr =
    "name,prefixes,number,section,studentHours,facultyHours,startTime,duration,location,roomCapacity,year,term,half,days,globalMax,localMax,anticipatedSize,instructors,comments";
  schedule.sections.forEach((section) => {
    const meeting = section.meetings ? section.meetings[0] : null;
    csvStr += `\n${section.course.name},${section.course.prefixes},${section.course.number},${
      section.letter
    },${section.studentHours ?? section.course.studentHours},${
      section.facultyHours ?? section.course.facultyHours
    },${meeting ? meeting.startTime : ""},${meeting ? meeting.duration : ""},${
      meeting ? meeting.location.building + meeting.location.roomNumber : ""
    },${meeting ? meeting.location.roomCapacity : ""},${section.year},${section.term},${
      section.half
    },${meeting ? meeting.days : ""}`;
  });
  return csvStr;
};
