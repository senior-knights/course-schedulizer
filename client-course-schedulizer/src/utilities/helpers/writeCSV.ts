import { forEach } from "lodash";
import moment, { Moment } from "moment";
import { Schedule, Section, Term } from "utilities/interfaces";

// Simplified version of scheduleToFullCSVString() from writeFullCSV.ts to conform to new standard
export const scheduleToCSVString = (schedule: Schedule): string => {
  let csvStr = "Term,Section Name,Stu Cred,Fac Load,Room,Days,Meeting Time,Short Title,Faculty\n";
  schedule.courses.forEach((course) => {
    // Only produce output for courses with a prefix and number (else assume they are non-teaching loads)
    if ((course.prefixes.length && course.prefixes[0]) || course.number) {
      course.sections.forEach((section) => {
        // Iterate through meetings to construct relevant strings
        let startMoment;
        let endMoment;
        let meetingTimeStr = "";
        let buildingAndRoomStr = "";
        let daysStr = "";
        section.meetings.forEach((meeting) => {
          startMoment = moment(meeting.startTime, "h:mm A");
          endMoment = startMoment.clone().add(meeting.duration, "minutes");
          if (startMoment.isValid()) {
            meetingTimeStr += getMeetingTimeStr(startMoment, endMoment);
          } else {
            meetingTimeStr += "\n";
          }
          buildingAndRoomStr += meeting.location.roomNumber
            ? `${meeting.location.building} ${meeting.location.roomNumber}\n`
            : `${meeting.location.building}\n`;
          daysStr += `${meeting.days.join("")}\n`;
        });
        // Remove trailing newlines
        meetingTimeStr = meetingTimeStr.slice(0, -1);
        buildingAndRoomStr = buildingAndRoomStr.slice(0, -1);
        daysStr = daysStr.slice(0, -1);
        // Create strings for fields that need to be constructed
        const termStr = getTermsStr(section);
        const sectionNameStr = `${course.prefixes.length ? course.prefixes[0] : ""}-${
          course.number
        }-${section.letter}`;

        // Construct a row in the output CSV
        csvStr += `${termStr},"${sectionNameStr}",${(
          section.studentHours ?? course.studentHours
        ).toFixed(2)},${(section.facultyHours ?? course.facultyHours).toFixed(
          2,
        )},"${buildingAndRoomStr}","${daysStr}","${meetingTimeStr}","${
          course.name
        }","${section.instructors.join("\n")}"\n`;
      });
    }
  });
  return csvStr;
};

export const scheduleToNonTeachingCSVString = (schedule: Schedule): string => {
  let csvStr = "Term(s),Non-Teaching Activity,Fac Load,Faculty\n";
  schedule.courses.forEach((course) => {
    // Only produce output for courses that don't have a prefix and number (assume they are non-teaching loads)
    if (!((course.prefixes.length && course.prefixes[0]) || course.number)) {
      course.sections.forEach((section) => {
        // Create strings for fields that need to be constructed
        const termStr = getTermsStr(section);

        // TODO: Should instructionalMethod be used for Non-Teaching Activity or should we add a new field?
        // Construct a row in the output CSV
        csvStr += `${termStr},${section.instructionalMethod},${(
          section.facultyHours ?? course.facultyHours
        ).toFixed(2)},"${section.instructors.join("\n")}"\n`;
      });
    }
  });
  return csvStr;
};

export const getTermsStr = (section: Section): string => {
  if (Array.isArray(section.term)) {
    let termsStr = '"';
    forEach(section.term, (term) => {
      termsStr += `${getTermStr(section.year, term)}, `;
    });
    return `${termsStr.slice(0, -2)}"`;
  }
  return getTermStr(section.year, section.term);
};

const getTermStr = (year: Section["year"], term: Term) => {
  return `${
    typeof year === "number"
      ? term === Term.Fall
        ? String(year).slice(-2)
        : String(year + 1).slice(-2)
      : term === Term.Fall
      ? String(Number(year.slice(-2)) - 1)
      : year.slice(-2)
  }/${term}`;
};

export const getMeetingTimeStr = (startMoment: Moment, endMoment: Moment): string => {
  return `${startMoment.format("h:mmA")} - ${endMoment.format("h:mmA")}\n`;
};
