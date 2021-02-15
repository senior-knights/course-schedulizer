import moment from "moment";
import { getMeetingTimeStr, getTermsStr } from "utilities/helpers";
import { Day, Schedule } from "utilities/interfaces";

// TODO: Deprecate and/or delete this function, replacing it with scheduleToCSVString() from writeCSV.ts?
export const scheduleToFullCSVString = (schedule: Schedule): string => {
  const numericReg = RegExp("[0-9]");
  let csvStr =
    "Department,Term,TermStart,AcademicYear,SectionName,SubjectCode,CourseNum,SectionCode,CourseLevelCode,MinimumCredits,FacultyLoad,Used,Day10Used,LocalMax,GlobalMax,RoomCapacity,BuildingAndRoom,MeetingDays,MeetingTime,SectionStartDate,SectionEndDate,SemesterLength,Building,RoomNumber,MeetingStart,MeetingStartInternal,MeetingDurationMinutes,MeetingEnd,MeetingEndInternal,Monday,Tuesday,Wednesday,Thursday,Friday,ShortTitle,Faculty,SectionStatus,InstructionalMethod,Comments\n";
  schedule.courses.forEach((course) => {
    course.sections.forEach((section) => {
      // Iterate through meetings to construct relevant strings
      let startMoment;
      let endMoment;
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
        endMoment = startMoment.clone().add(meeting.duration, "minutes");
        if (startMoment.isValid()) {
          meetingTimeStr += getMeetingTimeStr(startMoment, endMoment);
          meetingStartStr += `${startMoment.format("h:mm A")}\n`;
          meetingStartInternalStr += `${startMoment.format("H:mm:ss")}\n`;
          meetingEndStr += `${endMoment.format("h:mm A")}\n`;
          meetingEndInternalStr += `${endMoment.format("H:mm:ss")}\n`;
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
      const termStr = getTermsStr(section);
      const sectionNameStr = `${course.prefixes.length ? course.prefixes[0] : ""}-${
        course.number
      }-${section.letter}`;
      const courseLevelCodeStr = numericReg.test(course.number[0])
        ? `${course.number[0]}00`
        : "100";

      // Construct a row in the output CSV
      csvStr += `"${course.department}",${termStr},${section.termStart},${
        section.year
      },"${sectionNameStr}","${course.prefixes.join("\n")}",${course.number},${
        section.letter
      },${courseLevelCodeStr},${section.studentHours ?? course.studentHours},${
        section.facultyHours ?? course.facultyHours
      },${section.used},${section.day10Used},${section.localMax},${
        section.globalMax
      },"${roomCapacityStr}","${buildingAndRoomStr}","${daysStr}","${meetingTimeStr}",${
        section.startDate
      },${section.endDate},${
        section.semesterLength
      },"${buildingStr}","${roomNumberStr}","${meetingStartStr}","${meetingStartInternalStr}","${meetingDurationMinutesStr}","${meetingEndStr}","${meetingEndInternalStr}","${monStr}","${tuesStr}","${wedStr}","${thursStr}","${friStr}","${
        course.name
      }","${section.instructors.join("\n")}","${section.status}","${
        section.instructionalMethod
      }","${section.comments}"\n`;
    });
  });
  return csvStr;
};
