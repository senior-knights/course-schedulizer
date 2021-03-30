import { filter, forEach, sumBy } from "lodash";
import {
  Course,
  CourseSectionMeeting,
  emptyMeeting,
  getSectionName,
  Schedule,
  Section,
  Term,
} from "utilities";
import { Instructor } from "utilities/interfaces";

type hourKeys = "fallHours" | "springHours" | "summerHours" | "totalHours" | "otherHours";
type sectionKeys =
  | "fallCourseSections"
  | "springCourseSections"
  | "summerCourseSections"
  | "otherDuties";

// Define format for Faculty Load course hours specification.
const loadHoursRegEx = / \(\d*\)/;

export type FacultyRow = {
  [key in hourKeys]?: number;
} &
  {
    [key in sectionKeys]?: string;
  } & {
    faculty: string;
    loadNotes?: string;
    otherDuties?: string;
  };

interface UpdateRowParams {
  course: Course;
  newRow: FacultyRow;
  prevRow: FacultyRow;
  section: Section;
  sectionName: string;
  termName?: "fall" | "spring" | "summer" | "other";
}

const updateRow = ({
  course,
  newRow,
  prevRow,
  section,
  sectionName,
  termName,
}: UpdateRowParams) => {
  const termCourseSectionProp =
    termName === "other" ? "otherDuties" : (`${termName}CourseSections` as sectionKeys);
  const termHoursProp = `${termName}Hours` as hourKeys;
  const facultyHours =
    (section.facultyHours !== undefined ? section.facultyHours : course.facultyHours) /
    section.instructors.length;
  // Add faculty load hours using the format specified by loadHoursRegEx.
  const sectionNameWithHours = `${sectionName} (${facultyHours})`;
  if (prevRow) {
    prevRow[termCourseSectionProp] = prevRow[termCourseSectionProp]
      ? (prevRow[
          termCourseSectionProp
        ] = `${prevRow[termCourseSectionProp]}, ${sectionNameWithHours}`)
      : (prevRow[termCourseSectionProp] = sectionNameWithHours);

    prevRow[termHoursProp] = prevRow[termHoursProp]
      ? Number(prevRow[termHoursProp]) + facultyHours
      : facultyHours;
  } else {
    newRow[termCourseSectionProp] = sectionNameWithHours;
    newRow[termHoursProp] = facultyHours;
  }
};

export const createTable = (schedule: Schedule): FacultyRow[] => {
  const newTableData: FacultyRow[] = [];
  forEach(schedule.courses, (course) => {
    forEach(course.sections, (section) => {
      const sectionName = getSectionName(course, section);
      forEach(section.instructors, (instructor) => {
        const newFacultyRow: FacultyRow = {
          faculty: instructor,
        };
        const [prevAddedFacultyRow] = filter(newTableData, (data) => {
          return data.faculty === instructor;
        });
        const updateArgs = {
          course,
          newRow: newFacultyRow,
          prevRow: prevAddedFacultyRow,
          section,
          sectionName,
        };
        if (section.isNonTeaching) {
          updateRow({ ...updateArgs, sectionName: section.instructionalMethod, termName: "other" });
        } else {
          switch (section.term) {
            case Term.Fall:
              updateRow({ ...updateArgs, termName: "fall" });
              break;
            case Term.Spring:
              updateRow({ ...updateArgs, termName: "spring" });
              break;
            case Term.Summer:
            case Term.Interim:
              updateRow({ ...updateArgs, termName: "summer" });
              break;
            default:
              // eslint-disable-next-line no-console
              console.log(`Fell through case statement with value ${section.term}`);
              break;
          }
        }
        if (prevAddedFacultyRow) {
          newTableData[newTableData.indexOf(prevAddedFacultyRow)] = prevAddedFacultyRow;
        } else {
          newTableData.push(newFacultyRow);
        }
      });
    });
  });
  const sortedTableData = newTableData
    .map((row) => {
      return {
        ...row,
        totalHours:
          (row.fallHours || 0) +
          (row.springHours || 0) +
          (row.summerHours || 0) +
          (row.otherHours || 0),
      };
    })
    .sort((a, b) => {
      return b.totalHours - a.totalHours;
    });
  sortedTableData.push({
    faculty: "Total",
    fallHours: sumBy(sortedTableData, "fallHours"),
    otherHours: sumBy(sortedTableData, "otherHours"),
    springHours: sumBy(sortedTableData, "springHours"),
    summerHours: sumBy(sortedTableData, "summerHours"),
    totalHours: sumBy(sortedTableData, "totalHours"),
  });
  return sortedTableData;
};

export const findSection = (
  schedule: Schedule,
  sectionName: string,
  term: Term,
): CourseSectionMeeting | null => {
  if (!sectionName) {
    return null;
  }
  const [prefix, number, letter] = sectionName.split("-");

  // Find the course with the prefix and number from the schedule courses array
  const courses = filter(schedule.courses, (c) => {
    return c.prefixes.includes(prefix) && c.number === number;
  });
  if (!courses.length) {
    return null;
  }
  // Extract the course from the array
  const [course] = courses;

  // Find the section with the letter and term from the course sections array
  const sections = filter(course.sections, (s) => {
    return s.letter === letter && s.term === term;
  });
  if (!sections.length) {
    return null;
  }
  // Extract the section from the array
  const [section] = sections;

  return {
    course,
    meeting: section.meetings ? section.meetings[0] : emptyMeeting,
    section,
  };
};

export const getCourseSectionMeetingFromCell = (
  schedule: Schedule,
  cellValue: string,
  cellHeader: string,
): CSMIterableKeyMap => {
  // Remove the load hours spec from the string before splitting on comma.
  const sectionStrList = cellValue.split(loadHoursRegEx).join("").split(", ");
  const courseSectionHeaders = [
    "Fall Course Sections",
    "Spring Course Sections",
    "Summer Course Sections",
  ];
  if (courseSectionHeaders.includes(cellHeader)) {
    let term: Term = Term.Fall;
    switch (cellHeader) {
      case "Fall Course Sections":
        term = Term.Fall;
        break;
      case "Spring Course Sections":
        term = Term.Spring;
        break;
      case "Summer Course Sections":
        term = Term.Summer;
        break;
      default:
        break;
    }
    let courseSectionMeeting = findSection(schedule, sectionStrList[0], term);
    if (courseSectionMeeting === null) {
      term = Term.Interim;
      courseSectionMeeting = findSection(schedule, sectionStrList[0], Term.Interim);
    }
    return {
      csm: courseSectionMeeting,
      iterable: sectionStrList,
      key: term,
    };
  }
  return {
    csm: null,
    iterable: sectionStrList,
    key: Term.Fall,
  };
};

export const findNonTeachingLoad = (
  schedule: Schedule,
  nonTeachingActivity: string,
  instructor: Instructor,
): CourseSectionMeeting | null => {
  if (!nonTeachingActivity) {
    return null;
  }

  const nonTeachingLoadsArray = filter(schedule.courses, (c) => {
    return c.prefixes.length === 0 && c.number === "";
  });
  if (!nonTeachingLoadsArray.length) {
    return null;
  }
  const [nonTeachingLoads] = nonTeachingLoadsArray;

  const nonTeachingLoadArray = filter(nonTeachingLoads.sections, (s) => {
    return (
      s.isNonTeaching === true &&
      s.instructionalMethod === nonTeachingActivity &&
      s.instructors.includes(instructor)
    );
  });
  if (!nonTeachingLoadArray.length) {
    return null;
  }
  const [nonTeachingLoad] = nonTeachingLoadArray;

  return {
    course: nonTeachingLoads,
    meeting: emptyMeeting,
    section: nonTeachingLoad,
  };
};

/**
 * A specific CSM with with corresponding iterable
 *   and key.
 *
 * @export
 * @interface CSMIterableKeyMap
 */
export interface CSMIterableKeyMap {
  csm: CourseSectionMeeting | null;
  iterable: string[];
  key: string;
}

export const getNonTeachingLoadsFromCell = (
  schedule: Schedule,
  cellValue: string,
  instructor: Instructor,
): CSMIterableKeyMap => {
  // Remove the load hours spec from the string before splitting on comma.
  const nonTeachingLoadStrList = cellValue.split(loadHoursRegEx).join("").split(", ");
  const courseSectionMeeting = findNonTeachingLoad(schedule, nonTeachingLoadStrList[0], instructor);

  return {
    csm: courseSectionMeeting,
    iterable: nonTeachingLoadStrList,
    key: instructor,
  };
};

/**
 * Components with this reference will have a function handleModalOpen which
 *   can be called.
 *
 * @export
 * @type
 */
export type UpdateModalPaginationRef = {
  handleModalOpen: ({ csm, iterable, key }: CSMIterableKeyMap) => void;
};
