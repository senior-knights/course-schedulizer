import { EventInput } from "@fullcalendar/react";
import { filter, flatten, forEach, forOwn, map, maxBy, minBy } from "lodash";
import range from "lodash/range";
import moment from "moment";
import { initialDate } from "../../components/reuseables/Calendar";
import { enumArray } from "../helpers/utils";
import { Day, Meeting, Schedule, Section, Term } from "../interfaces/dataInterfaces";

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
  const days: Day[] = enumArray(Day);
  forEach(schedule.courses, (course) => {
    forEach(course.sections, (section) => {
      const sectionName = `${course.prefixes[0]}-${course.number}-${section.letter}`;
      forEach(section.instructors, (prof) => {
        forEach(section.meetings, (meeting) => {
          const room = `${meeting.location.building} ${meeting.location.roomNumber}`;
          const group = groups === "faculty" ? prof : room;
          const startTimeMoment = moment(meeting.startTime, "h:mma");
          const endTimeMoment = moment(startTimeMoment).add(meeting.duration, "minutes");
          forEach(meeting.days, (day) => {
            const dayOfWeek = moment(initialDate)
              .add(days.indexOf(day) + 1, "days")
              .format("YYYY-MM-DD");
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
    return moment(meeting.startTime, "h:mma").add(meeting.duration, "minutes").format("HH:mm");
  });
  const minTime = minBy(startTimes)?.format("HH:mm") || "6:00";
  const maxTime = maxBy(endTimes) || "22:00";
  return {
    maxTime,
    minTime,
  };
};

export const filterEventsByTerm = (groupedEvents: GroupedEvents, term: Term) => {
  const tempGroupedEvents: GroupedEvents = {};
  forOwn(groupedEvents, (_, key) => {
    tempGroupedEvents[key] = filter(groupedEvents[key], (e) => {
      return e.extendedProps?.section.term === term;
    });
  });
  return tempGroupedEvents;
};

export const filterHeadersWithNoEvents = (filteredEvents: GroupedEvents, headers: string[]) => {
  return filter(headers, (header) => {
    const groupEvents = filteredEvents[header];
    return groupEvents?.length > 0;
  });
};
