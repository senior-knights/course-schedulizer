import { EventInput } from "@fullcalendar/react";
import { ScheduleBaseProps } from "components";
import { filter, flatten, forEach, forOwn, map, maxBy, minBy, range } from "lodash";
import moment from "moment";
import hash from "object-hash";
import randomColor from "randomcolor";
import { enumArray, WILDCARD_COLOR } from "utilities";
import { INITIAL_DATE } from "utilities/constants";
import { ColorBy, Day, Location, Meeting, Schedule, Section, Term } from "utilities/interfaces";
import { Constraints, findConflicts } from "./conflictsService";

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

const eventExistsInEventList = (event: EventInput, eventList: EventInput[]): boolean => {
  return eventList.some((e) => {
    return (
      e.title === event.title &&
      e.start === event.start &&
      e.end === event.end &&
      e.term === event.term
    );
  });
};

// TODO: Add events with no meeting times as all day
export const getEvents = (
  schedule: Schedule,
  groups: "faculty" | "room" | "department",
  constraints?: Constraints,
): GroupedEvents => {
  const events: GroupedEvents = {};
  const days: Day[] = enumArray(Day);
  const scheduleWithConflicts = findConflicts(schedule, constraints);
  forEach(scheduleWithConflicts.courses, (course) => {
    const dept = course.department ? course.department : "No Department";
    forEach(course.sections, (section) => {
      const sectionName = `${course.prefixes[0]}-${course.number}-${section.letter}`;
      forEach(section.instructors, (prof) => {
        forEach(section.meetings, (meeting) => {
          const room = getLocationString(meeting.location);
          const className = createEventClassName(sectionName, room, prof);
          let group = "";
          if (groups === "faculty") {
            group = prof;
          } else if (groups === "room") {
            group = room;
          } else {
            group = dept;
          }
          const startTimeMoment = moment(meeting.startTime, "h:mm A");
          const endTimeMoment = moment(startTimeMoment).add(meeting.duration, "minutes");
          // Don't display meetings which span more than one day
          if (startTimeMoment.format("YYYY-MM-DD") === endTimeMoment.format("YYYY-MM-DD")) {
            forEach(meeting.days, (day) => {
              const dayOfWeek = moment(INITIAL_DATE)
                .add(days.indexOf(day) + 1, "days")
                .format("YYYY-MM-DD");
              const newEvent: EventInput = {
                classNames: [className],
                description: course.name,
                end: `${dayOfWeek}T${endTimeMoment.format("HH:mm")}`,
                extendedProps: {
                  course,
                  meeting,
                  section,
                },
                start: `${dayOfWeek}T${startTimeMoment.format("HH:mm")}`,
                term: section.term,
                title: sectionName,
              };
              if (events[group]) {
                // Only add the event if it hasn't already been added
                // TODO: Will this conceal conflicts (specifically duplicated courses/sections/meetings)?
                if (!eventExistsInEventList(newEvent, events[group])) {
                  events[group].push(newEvent);
                }
              } else {
                events[group] = [newEvent];
              }
            });
          }
        });
      });
    });
  });
  return events;
};

export const createEventClassName = (sectionName: string, room: string, prof: string): string => {
  const identifier = `${sectionName}_${prof}_${room}`;
  return identifier.replace(/ /g, "_");
};

export const getMinAndMaxTimes = (schedule: Schedule) => {
  findConflicts(schedule);
  const sections: Section[] = flatten(map(schedule.courses, "sections"));
  const meetings: Meeting[] = flatten(map(sections, "meetings"));
  let startDate = "";
  const startTimes = map(meetings, (meeting) => {
    return moment(meeting.startTime, "h:mm A");
  });
  if (startTimes.length) {
    startDate = startTimes[0].format("YYYY-MM-DD");
  }
  let endTimes = map(meetings, (meeting) => {
    return moment(meeting.startTime, "h:mm A").add(meeting.duration, "minutes");
  });
  // If the meeting ends on a different day than it started, don't include it
  endTimes = endTimes.filter((endTime) => {
    return endTime.format("YYYY-MM-DD") === startDate;
  });
  const minTime = (minBy(startTimes) || moment("06:00", "HH:mm")).startOf("hour").format("HH:mm");
  let maxTime = (maxBy(endTimes) || moment("22:00", "HH:mm"))
    .add(1, "hours")
    .startOf("hour")
    .format("HH:mm");
  maxTime = maxTime === "00:00" ? "24:00" : maxTime;
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

export const colorConflictBorders = (groupedEvents: GroupedEvents) => {
  forOwn(groupedEvents, (_, key) => {
    forEach(groupedEvents[key], (event) => {
      if (event.extendedProps?.meeting?.isConflict) {
        event.borderColor = "red";
      }
    });
  });
};

export const colorEventsByFeature = (groupedEvents: GroupedEvents, colorBy: ColorBy) => {
  // TODO: Multiple colors for multiple instructors/prefixes?
  // TODO: Pre-hashing strings too slow?
  // Hash the strings before seeding the random color because it seemed that similar strings gave similar colors
  switch (colorBy) {
    case ColorBy.Room:
      forOwn(groupedEvents, (_, key) => {
        forEach(groupedEvents[key], (event) => {
          const building = event.extendedProps?.meeting?.location?.building;
          const roomNum = event.extendedProps?.meeting?.location?.roomNumber;
          const roomStr = `${building} ${roomNum}`;
          event.color =
            event.extendedProps?.section?.instructors[0] === "*"
              ? WILDCARD_COLOR
              : randomColor({ luminosity: "light", seed: hash(roomStr) });
          event.textColor = "black";
        });
      });
      break;
    case ColorBy.Instructor:
      forOwn(groupedEvents, (_, key) => {
        forEach(groupedEvents[key], (event) => {
          let instructorStr = "";
          forEach(event.extendedProps?.section?.instructors, (instructor) => {
            instructorStr += `${instructor}, `;
          });
          // event.color = randomColor({ luminosity: "light", seed: hash(instructorStr) });
          event.color =
            instructorStr === "*, "
              ? WILDCARD_COLOR
              : randomColor({
                  luminosity: "light",
                  seed: hash(instructorStr),
                });
          event.textColor = "black";
        });
      });
      break;
    case ColorBy.Prefix:
      forOwn(groupedEvents, (_, key) => {
        forEach(groupedEvents[key], (event) => {
          let prefixStr = "";
          forEach(event.extendedProps?.course?.prefixes, (prefix) => {
            prefixStr += `${prefix}, `;
          });
          // event.color = randomColor({ luminosity: "light", seed: hash(prefixStr) });
          event.color =
            event.extendedProps?.section?.instructors[0] === "*"
              ? WILDCARD_COLOR
              : randomColor({ luminosity: "light", seed: hash(prefixStr) });
          event.textColor = "black";
        });
      });
      break;
    default:
      forOwn(groupedEvents, (_, key) => {
        forEach(groupedEvents[key], (event) => {
          const levelStr = String(event.extendedProps?.course?.number)[0];
          switch (levelStr) {
            case "1":
              // Pastel green (suggests easy difficulty)
              event.color = "#c2ffc4";
              break;
            case "2":
              // Pastel yellow (suggests medium difficulty)
              event.color = "#fffec2";
              break;
            case "3":
              // Pastel red (suggests hard difficulty)
              event.color = "#ffc2c2";
              break;
            default:
              event.color =
                event.extendedProps?.section?.instructors[0] === "*"
                  ? WILDCARD_COLOR
                  : randomColor({
                      luminosity: "light",
                      seed: hash(levelStr ?? "no-level"),
                    });
          }
          event.textColor = "black";
        });
      });
  }
  return groupedEvents;
};

export const getPrefixes = (schedule: Schedule) => {
  const prefixes: string[] = [];
  forEach(schedule.courses, (course) => {
    forEach(course.prefixes, (prefix) => {
      if (!prefixes.includes(prefix)) {
        prefixes.push(prefix);
      }
    });
  });
  return prefixes.sort();
};

export const getNumbers = (schedule: Schedule) => {
  const numbers: string[] = [];
  forEach(schedule.courses, (course) => {
    if (!numbers.includes(course.number)) {
      numbers.push(course.number);
    }
  });
  return numbers.sort();
};

export const getCourseNames = (schedule: Schedule) => {
  const names: string[] = [];
  forEach(schedule.courses, (course) => {
    if (!names.includes(course.name)) {
      names.push(course.name);
    }
  });
  return names.sort();
};

export const getSectionLetters = (schedule: Schedule) => {
  const letters: string[] = [];
  forEach(schedule.courses, (course) => {
    forEach(course.sections, (section) => {
      if (!letters.includes(section.letter)) {
        letters.push(section.letter);
      }
    });
  });
  return letters.sort();
};

export const getInstructionalMethods = (schedule: Schedule) => {
  const instructionalMethods: string[] = [];
  forEach(schedule.courses, (course) => {
    forEach(course.sections, (section) => {
      if (
        section.instructionalMethod &&
        !instructionalMethods.includes(section.instructionalMethod) &&
        !section.isNonTeaching
      ) {
        instructionalMethods.push(section.instructionalMethod);
      }
    });
  });
  return instructionalMethods.sort();
};

export const getDepts = (schedule: Schedule) => {
  const departments: string[] = [];
  forEach(schedule.courses, (course) => {
    const deptStr = course.department ? course.department : "No Department";
    if (!departments.includes(deptStr)) {
      departments.push(deptStr);
    }
  });
  return departments.sort();
};

export const getLocationString = (location: Location): string => {
  return `${location.building} ${location.roomNumber}`;
};

/* Generate a css class name. apply additional styles
 * specifically for the department tab view
 */
export const getCalendarClassName = (scheduleType: ScheduleBaseProps["scheduleType"]) => {
  let className = "calendar-width calendar-title";
  if (scheduleType === "department") {
    className += " department-calendar-width";
  }
  return className;
};
