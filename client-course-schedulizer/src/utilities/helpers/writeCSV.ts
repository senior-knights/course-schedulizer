import * as di from "../interfaces/dataInterfaces";

export const scheduleToCSVString = (schedule: di.Schedule): string => {
  let csvStr =
    "name,prefixes,number,section,studentHours,facultyHours,startTime,duration,location,roomCapacity,year,term,semesterLength,days,globalMax,localMax,anticipatedSize,instructors,comments";
  schedule.courses.forEach((course) => {
    course.sections.forEach((section) => {
      // Iterate through meetings to construct relevant strings
      let startTimeStr = "";
      let durationStr = "";
      let locationStr = "";
      let roomCapacityStr = "";
      let daysStr = "";
      section.meetings.forEach((meeting) => {
        startTimeStr += `${meeting.startTime}\n`;
        durationStr += `${meeting.duration}\n`;
        locationStr += meeting.location.roomNumber
          ? `${meeting.location.building} ${meeting.location.roomNumber}\n`
          : `${meeting.location.building}\n`;
        roomCapacityStr += `${meeting.location.roomCapacity}\n`;
        daysStr += `${meeting.days.join("")}\n`;
      });
      // Remove trailing newlines
      startTimeStr = startTimeStr.slice(0, -1);
      durationStr = durationStr.slice(0, -1);
      locationStr = locationStr.slice(0, -1);
      roomCapacityStr = roomCapacityStr.slice(0, -1);
      daysStr = daysStr.slice(0, -1);
      // TODO: Be wary of commas in strings?
      csvStr += `\n"${course.name}",${course.prefixes.join(";")},${course.number},${
        section.letter
      },${section.studentHours ?? course.studentHours},${
        section.facultyHours ?? course.facultyHours
      },"${startTimeStr}","${durationStr}","${locationStr}","${roomCapacityStr}",${section.year},${
        section.term
      },${section.semesterLength},"${daysStr}",${section.globalMax},${section.localMax},${
        section.anticipatedSize
      },${section.instructors.join(";")},${section.comments},`;
    });
  });
  return csvStr;
};
