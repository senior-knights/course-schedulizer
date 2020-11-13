import { EventInput } from "@fullcalendar/react";
import forEach from "lodash/forEach";
import moment from "moment";
import { initialDate } from "../../components/reuseables/Calendar";
import { Day, Schedule } from "../interfaces/dataInterfaces";

// Get list of unique professors.
export const getProfs = (schedule: Schedule): string[] => {
  const professorsSet = new Set<string>();
  forEach(schedule.courses, (course) => {
    forEach(course.sections, (section) => {
      forEach(section.instructors, (prof) => {
        professorsSet.add(prof);
      });
    });
  });
  return [...professorsSet];
};

export const getFacultyEvents = (schedule: Schedule): EventInput[] => {
  const events: EventInput[] = [];
  const days: Day[] = Object.keys(Day).map((day) => {
    return Day[day as keyof typeof Day];
  });
  forEach(schedule.courses, (course) => {
    forEach(course.sections, (section) => {
      forEach(section.instructors, (prof) => {
        forEach(section.meetings, (meeting) => {
          forEach(meeting.days, (day) => {
            const startTimeMoment = moment(meeting.startTime, "h:mma");
            const endTimeMoment = moment(startTimeMoment).add(meeting.duration, "minutes");
            const dayOfWeek = moment(initialDate)
              .add(days.indexOf(day) + 1, "days")
              .format("YYYY-MM-DD");
            const sectionName = `${course.prefixes[0]}-${course.number}-${section.letter}`;
            events.push({
              description: course.name,
              end: `${dayOfWeek}T${endTimeMoment.format("HH:mm")}`,
              extendedProps: {
                course,
                header: prof,
                meeting,
                section,
              },
              start: `${dayOfWeek}T${startTimeMoment.format("HH:mm")}`,
              title: sectionName,
            });
          });
        });
      });
    });
  });
  return events;
};
