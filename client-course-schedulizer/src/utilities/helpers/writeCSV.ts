import moment from "moment";
import { Day, Schedule, Term } from "utilities/interfaces";

export const scheduleToCSVString = (schedule: Schedule): string => {
  const numericReg = RegExp("[0-9]");
  let csvStr =
    "Department,Term,TermStart,AcademicYear,SectionName,SubjectCode,CourseNum,SectionCode,CourseLevelCode,MinimumCredits,FacultyLoad,Used,Day10Used,LocalMax,Global Max,RoomCapacity,BuildingAndRoom,MeetingDays,MeetingTime,SectionStartDate,SectionEndDate,Building,RoomNumber,MeetingStart,MeetingStartInternal,MeetingDurationMinutes,MeetingEnd,MeetingEndInternal,Monday,Tuesday,Wednesday,Thursday,Friday,ShortTitle,Faculty,SectionStatus,InstructionalMethod";
  schedule.courses.forEach((course) => {
    course.sections.forEach((section) => {
      // Iterate through meetings to construct relevant strings
      let startMoment;
      let meetingTimeStr = "";
      let meetingStartStr = "";
      let meetingStartInternalStr = "";
      let meetingEndStr = "";
      let meetingEndInternalStr = "";
      let meetingDurationMinutesStr = "";
      let buildingStr = "";
      let roomNumberStr = "";
      let buildingAndRoomStr = "";
      let roomCapacityStr = "";
      let daysStr = "";
      let monStr = "";
      let tuesStr = "";
      let wedStr = "";
      let thursStr = "";
      let friStr = "";
      section.meetings.forEach((meeting) => {
        startMoment = moment(meeting.startTime, "h:mm A");
        if (startMoment.isValid()) {
          meetingTimeStr += `${startMoment.format("h:mmA")} - ${startMoment
            .add(meeting.duration, "minutes")
            .format("h:mm A")}\n`;
          meetingStartStr += `${startMoment.format("h:mm A")}\n`;
          meetingStartInternalStr += `${startMoment.format("H:mm:ss")}\n`;
          meetingEndStr += `${startMoment.add(meeting.duration, "minutes").format("h:mm A")}\n`;
          meetingEndInternalStr += `${startMoment
            .add(meeting.duration, "minutes")
            .format("H:mm:ss")}\n`;
        } else {
          meetingTimeStr += "\n";
          meetingStartStr += "\n";
          meetingStartInternalStr += "\n";
          meetingEndStr += "\n";
          meetingEndInternalStr += "\n";
        }
        meetingDurationMinutesStr += `${meeting.duration}\n`;
        buildingStr += `${meeting.location.building}\n`;
        roomNumberStr += `${meeting.location.roomNumber}\n`;
        buildingAndRoomStr += meeting.location.roomNumber
          ? `${meeting.location.building} ${meeting.location.roomNumber}\n`
          : `${meeting.location.building}\n`;
        roomCapacityStr += `${meeting.location.roomCapacity}\n`;
        daysStr += `${meeting.days.join("")}\n`;
        monStr += `${meeting.days.includes(Day.Monday) ? "M" : ""}\n`;
        tuesStr += `${meeting.days.includes(Day.Tuesday) ? "T" : ""}\n`;
        wedStr += `${meeting.days.includes(Day.Wednesday) ? "W" : ""}\n`;
        thursStr += `${meeting.days.includes(Day.Thursday) ? "TH" : ""}\n`;
        friStr += `${meeting.days.includes(Day.Friday) ? "F" : ""}\n`;
      });
      // Remove trailing newlines
      meetingTimeStr = meetingTimeStr.slice(0, -1);
      meetingStartStr = meetingStartStr.slice(0, -1);
      meetingStartInternalStr = meetingStartInternalStr.slice(0, -1);
      meetingEndStr = meetingEndStr.slice(0, -1);
      meetingEndInternalStr = meetingEndInternalStr.slice(0, -1);
      meetingDurationMinutesStr = meetingDurationMinutesStr.slice(0, -1);
      buildingStr = buildingStr.slice(0, -1);
      roomNumberStr = roomNumberStr.slice(0, -1);
      buildingAndRoomStr = buildingAndRoomStr.slice(0, -1);
      roomCapacityStr = roomCapacityStr.slice(0, -1);
      daysStr = daysStr.slice(0, -1);
      monStr = monStr.slice(0, -1);
      tuesStr = tuesStr.slice(0, -1);
      wedStr = wedStr.slice(0, -1);
      thursStr = thursStr.slice(0, -1);
      friStr = friStr.slice(0, -1);
      // Create strings for fields that need to be constructed
      const termStr = `${
        typeof section.year === "number"
          ? section.term === Term.Fall
            ? String(section.year).slice(-2)
            : String(section.year + 1).slice(-2)
          : section.term === Term.Fall
          ? String(Number(section.year.slice(-2)) - 1)
          : section.year.slice(-2)
      }/${section.term}`;
      const sectionNameStr = `${course.prefixes.length ? course.prefixes[0] : ""}-${
        course.number
      }-${section.letter}`;
      const courseLevelCodeStr = numericReg.test(course.number[0])
        ? `${course.number[0]}00`
        : "100";

      // Construct a row in the output CSV
      csvStr += `\nTODO Department,${termStr},TODO TermStart,${
        section.year
      },"${sectionNameStr}",${course.prefixes.join(";")},${course.number},${
        section.letter
      },${courseLevelCodeStr},${section.studentHours ?? course.studentHours},${
        section.facultyHours ?? course.facultyHours
      },TODO Used,TODO Day10Used,${section.localMax},${
        section.globalMax
      },"${roomCapacityStr}","${buildingAndRoomStr}","${daysStr}","${meetingTimeStr}",TODO SectionStartDate,TODO SectionEndDate,"${buildingStr}","${roomNumberStr}","${meetingStartStr}","${meetingStartInternalStr}","${meetingDurationMinutesStr}","${meetingEndStr}","${meetingEndInternalStr}","${monStr}","${tuesStr}","${wedStr}","${thursStr}","${friStr}","${
        course.name
      }",${section.instructors.join(";")},TODO SectionStatus,TODO InstructionalMethod`;
    });
  });
  return csvStr;
};
