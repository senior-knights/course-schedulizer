import { EventInput } from "@fullcalendar/react";
import { flatten, forEach, map, maxBy, minBy } from "lodash";
import range from "lodash/range";
import moment from "moment";
import { initialDate } from "../../components/reuseables/Calendar";
import { Day, Meeting, Schedule, Section } from "../interfaces/dataInterfaces";

// Returns a list of hours to display on the Schedule
// TODO: add better types for timing, maybe: https://stackoverflow.com/questions/51445767/how-to-define-a-regex-matched-string-type-in-typescript
export const getHoursArr = (min: string, max: string): number[] => {
  const minHour = parseInt(min.split(":")[0]);
  const maxHour = parseInt(max.split(":")[0]);
  return range(minHour, maxHour);
};

export interface GroupedEvents {
  [key: string]: EventInput[];
}

// TODO: Add events with no meeting times as all day
export const getEvents = (schedule: Schedule, groups: "faculty" | "room"): GroupedEvents => {
  const events: GroupedEvents = {};
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
            const room = `${meeting.location.building} ${meeting.location.roomNumber}`;
            const group = groups === "faculty" ? prof : room;
            const newEvent: EventInput = {
              description: course.name,
              end: `${dayOfWeek}T${endTimeMoment.format("HH:mm")}`,
              extendedProps: {
                course,
                meeting,
                section,
              },
              start: `${dayOfWeek}T${startTimeMoment.format("HH:mm")}`,
              title: sectionName,
            };
            if (events[group]) {
              events[group].push(newEvent);
            } else {
              events[group] = [newEvent];
            }
          });
        });
      });
    });
  });
  return events;
};

export const getMinAndMaxTimes = (schedule: Schedule) => {
  const sections: Section[] = flatten(map(schedule.courses, "sections"));
  const meetings: Meeting[] = flatten(map(sections, "meetings"));
  const startTimes = map(meetings, (meeting) => {
    return moment(meeting.startTime, "h:mma");
  });
  const endTimes = map(meetings, (meeting) => {
    return moment(meeting.startTime, "h:mma").add(meeting.duration, "minutes");
  });
  const minTime = minBy(startTimes)?.format("HH:mm") || "6:00";
  const maxTime = maxBy(endTimes)?.format("HH:mm") || "22:00";
  return {
    maxTime,
    minTime,
  };
};
