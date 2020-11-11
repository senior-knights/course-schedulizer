import * as di from "../interfaces/dataInterfaces";

export const scheduleToCSVString = (schedule: di.Schedule): string => {
  let csvStr =
    "name,prefixes,number,section,studentHours,facultyHours,startTime,duration,location,roomCapacity,year,term,semesterLength,days,globalMax,localMax,anticipatedSize,instructors,comments";
  schedule.courses.forEach((course) => {
    course.sections.forEach((section) => {
      // TODO: Instead of getting the first meeting, iterate through all meetings
      // TODO: Be wary of commas in strings?
      let instructorsStr = "";
      section.instructors.forEach((instructor) => {
        instructorsStr += `${instructor};`;
      });
      instructorsStr = instructorsStr.slice(0, -1);
      const meeting = section.meetings ? section.meetings[0] : null;
      csvStr += `\n${course.name},${course.prefixes.join(";")},${course.number},${section.letter},${
        section.studentHours ?? course.studentHours
      },${section.facultyHours ?? course.facultyHours},${meeting ? meeting.startTime : ""},${
        meeting ? meeting.duration : ""
      },${meeting ? `${meeting.location.building} ${meeting.location.roomNumber}` : ""},${
        meeting ? meeting.location.roomCapacity : ""
      },${section.year},${section.term},${section.semesterLength},${
        meeting ? meeting.days.join("") : ""
      },${section.globalMax},${section.localMax},${section.anticipatedSize},${instructorsStr},${
        section.comments
      },`;
    });
  });
  return csvStr;
};
