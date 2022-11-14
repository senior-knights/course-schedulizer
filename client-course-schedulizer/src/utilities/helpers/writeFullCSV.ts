import { forEach } from "lodash";
import moment, { Moment } from "moment";
import { Day, Schedule, Section, Term } from "utilities/interfaces";
import { getLocationString } from "utilities/services";

export const scheduleToFullCSVString = (schedule: Schedule): string => {
  const numericReg = RegExp("[0-9]");

  // Sorts the schedule object by dept, class number, section letter, term
  schedule.courses = schedule.courses.sort((a, b): number => {
    if (typeof a.department === "string" && typeof b.department === "string") {
      return (
        a.department.localeCompare(b.department) ||
        `${a.prefixes.length ? a.prefixes[0] : ""}-${a.number}`.localeCompare(
          `${b.prefixes.length ? b.prefixes[0] : ""}-${b.number}`,
        )
      );
    }
    return -1;
  });

  let csvStr =
    "Department,Term,SubjectCode,CourseNum,SectionCode,CourseLevelCode,MinimumCredits,FacultyLoad,BuildingAndRoom,MeetingDays,MeetingTime,SectionStartDate,SectionEndDate,SemesterLength,Building,RoomNumber,MeetingStart,MeetingDurationMinutes,MeetingEnd,ShortTitle,Faculty,SectionStatus,InstructionalMethod,Comments,LastEditTimestamp\n";
  schedule.courses.forEach((course) => {
    const termOrder = Object.values(Term);
    course.sections = course.sections.sort((a, b): number => {
      if (typeof a.term === "string" && typeof b.term === "string") {
        return (
          a.letter.localeCompare(b.letter) || termOrder.indexOf(a.term) - termOrder.indexOf(b.term) // a.term.localeCompare(b.term) ||
        );
      }
      return a.letter.localeCompare(b.letter);
    });

    course.sections.forEach((section) => {
      // const termOrder = Object.values(Term);
      // if(typeof section.term !== 'string') {
      //   section.term = section.term.sort((a,b): number => {
      //     return(
      //       termOrder.indexOf(b) - termOrder.indexOf(a)
      //     );
      // })};

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
      // let monStr = "";
      // let tuesStr = "";
      // let wedStr = "";
      // let thursStr = "";
      // let friStr = "";
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
          // meetingStartInternalStr += "\n";
          meetingEndStr += "\n";
          // meetingEndInternalStr += "\n";
        }
        meetingDurationMinutesStr += `${meeting.duration}\n`;
        if (meeting.location && meeting.location.building) {
          buildingStr += `${meeting.location.building}\n`;
          roomNumberStr += `${meeting.location.roomNumber}\n`;
          buildingAndRoomStr += meeting.location.roomNumber
            ? `${getLocationString(meeting.location)}\n`
            : `${meeting.location.building}\n`;
        }
        roomCapacityStr += `${meeting.location.roomCapacity ?? ""}\n`;
        daysStr += `${meeting.days.join("")}\n`;
        // monStr += `${meeting.days.includes(Day.Monday) ? "M" : ""}\n`;
        // tuesStr += `${meeting.days.includes(Day.Tuesday) ? "T" : ""}\n`;
        // wedStr += `${meeting.days.includes(Day.Wednesday) ? "W" : ""}\n`;
        // thursStr += `${meeting.days.includes(Day.Thursday) ? "TH" : ""}\n`;
        // friStr += `${meeting.days.includes(Day.Friday) ? "F" : ""}\n`;
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
      // monStr = monStr.slice(0, -1);
      // tuesStr = tuesStr.slice(0, -1);
      // wedStr = wedStr.slice(0, -1);
      // thursStr = thursStr.slice(0, -1);
      // friStr = friStr.slice(0, -1);
      // Create strings for fields that need to be constructed
      const termStr = getTermsStr(section);
      const sectionNameStr = `${course.prefixes.length ? course.prefixes[0] : ""}-${
        course.number
      }-${section.letter}`;
      const courseLevelCodeStr = numericReg.test(course.number[0]) ? `${course.number[0]}00` : "";

      // Construct a row in the output CSV
      csvStr += `"${course.department ?? ""}",${termStr
        },"${course.prefixes.join("\n")}",${course.number},${section.letter
        },${courseLevelCodeStr
        },${section.studentHours > -1 ? section.studentHours : ""}, ${section.facultyHours > -1 ? section.facultyHours : ""},"${buildingAndRoomStr
        }","${daysStr}","${meetingTimeStr}",${section.startDate ?? ""},${section.endDate ?? ""},${section.semesterLength ?? ""},"${buildingStr
        }","${roomNumberStr}","${meetingStartStr}","${meetingDurationMinutesStr
        }","${meetingEndStr}","${ section.name ?? course.name 
        }","${section.instructors.join("\n")}","${section.status ?? ""}","${section.instructionalMethod ?? "" }","${section.comments ?? ""}","${section.timestamp ?? ""}"\n`;
    });
  });
  return csvStr;
};

export const getMeetingTimeStr = (startMoment: Moment, endMoment: Moment): string => {
  return `${startMoment.format("h:mmA")} - ${endMoment.format("h:mmA")}\n`;
};

export const getTermsStr = (section: Section): string => {
  if (Array.isArray(section.term)) {
    if (section.term.length === 0) {
      return "";
    }
    let termsStr = '"';
    forEach(section.term, (term) => {
      termsStr += `${getTermStr(section.year, term)}, `;
    });
    return `${termsStr.slice(0, -2)}"`;
  }
  return getTermStr(section.year, section.term);
};

const getTermStr = (year: Section["year"], term: Term): string => {
  return year
    ? `${
        typeof year === "number"
          ? term === Term.Fall
            ? String(year).slice(-2)
            : String(year + 1).slice(-2)
          : term === Term.Fall
          ? String(Number(year?.slice(-2)) - 1)
          : year?.slice(-2)
      }/${term}`
    : term;
};
