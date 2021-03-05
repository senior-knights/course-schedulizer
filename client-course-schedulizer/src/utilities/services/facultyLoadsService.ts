import { filter } from "lodash";
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
  if (prevRow) {
    prevRow[termCourseSectionProp] = prevRow[termCourseSectionProp]
      ? (prevRow[termCourseSectionProp] = `${prevRow[termCourseSectionProp]}, ${sectionName}`)
      : (prevRow[termCourseSectionProp] = sectionName);

    prevRow[termHoursProp] = prevRow[termHoursProp]
      ? Number(prevRow[termHoursProp]) / section.instructors.length + facultyHours
      : facultyHours;
  } else {
    newRow[termCourseSectionProp] = sectionName;
    newRow[termHoursProp] = facultyHours;
  }
};

export const createTable = (schedule: Schedule): FacultyRow[] => {
  const newTableData: FacultyRow[] = [];
  schedule.courses.forEach((course) => {
    course.sections.forEach((section) => {
      const sectionName = getSectionName(course, section);
      section.instructors.forEach((instructor) => {
        const newFacultyRow: FacultyRow = {
          faculty: instructor,
        };
        const [prevAddedFacultyRow] = newTableData.filter((data) => {
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
  return newTableData
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
  const courses = filter(schedule.courses, (c) => {
    return c.prefixes.includes(prefix) && c.number === number;
  });
  if (!courses.length) {
    return null;
  }
  const [course] = courses;

  const sections = filter(course.sections, (s) => {
    return s.letter === letter && s.term === term;
  });
  if (!sections.length) {
    return null;
  }
  const [section] = sections;

  return {
    course,
    meeting: section.meetings ? section.meetings[0] : emptyMeeting,
    section,
  };
};

export interface CourseSectionMeetingTermSections {
  csm: CourseSectionMeeting | null;
  sectionList: string[];
  term: Term;
}

export const getCourseSectionMeetingFromCell = (
  schedule: Schedule,
  cellValue: string,
  cellHeader: string,
): CourseSectionMeetingTermSections => {
  const sectionStrList = cellValue.split(", ");
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
      sectionList: sectionStrList,
      term,
    };
  }
  return {
    csm: null,
    sectionList: sectionStrList,
    term: Term.Fall,
  };
};

export interface UpdateSectionModalPaginationRef {
  handleModalOpen: (csmTermSections: CourseSectionMeetingTermSections) => void;
}

export const findNonTeachingLoad = (
  schedule: Schedule,
  nonTeachingLoad: string,
  instructor: Instructor,
): CourseSectionMeeting | null => {
  if (!nonTeachingLoad) {
    return null;
  }

  const courses = filter(schedule.courses, (c) => {
    return c.prefixes.length === 0 && c.number === "";
  });
  if (!courses.length) {
    return null;
  }
  const [course] = courses;

  const sections = filter(course.sections, (s) => {
    return (
      s.isNonTeaching === true &&
      s.instructionalMethod === nonTeachingLoad &&
      s.instructors.includes(instructor)
    );
  });
  if (!sections.length) {
    return null;
  }
  const [section] = sections;

  return {
    course,
    meeting: emptyMeeting,
    section,
  };
};

export interface CourseSectionMeetingInstructorNonTeachingLoads {
  csm: CourseSectionMeeting | null;
  instructor: Instructor;
  nonTeachingLoads: string[];
}

export const getNonTeachingLoadsFromCell = (
  schedule: Schedule,
  cellValue: string,
  instructor: Instructor,
): CourseSectionMeetingInstructorNonTeachingLoads => {
  const nonTeachingLoadStrList = cellValue.split(", ");
  const courseSectionMeeting = findNonTeachingLoad(schedule, nonTeachingLoadStrList[0], instructor);

  return {
    csm: courseSectionMeeting,
    instructor,
    nonTeachingLoads: nonTeachingLoadStrList,
  };
};

export interface UpdateNonTeachingLoadModalPaginationRef {
  handleModalOpen: (
    csmInstructorNonTeachingLoads: CourseSectionMeetingInstructorNonTeachingLoads,
  ) => void;
}
