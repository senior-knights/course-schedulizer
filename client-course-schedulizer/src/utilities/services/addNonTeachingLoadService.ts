import { cloneDeep, map } from "lodash";
import { Course, CourseSectionMeeting, NonTeachingLoadInput, Section, Term } from "utilities";
import { emptyCourse, emptySection } from "utilities/constants";

export const mapNonTeachingLoadValuesToInput = (
  data?: CourseSectionMeeting,
): NonTeachingLoadInput => {
  const loadTerm = data?.section.term;
  const loadTermsArr = Array.isArray(loadTerm) ? loadTerm : [loadTerm];
  const terms = (map(Object.values(Term), (t) => {
    return loadTermsArr.includes(t) ? t : false;
  }) as unknown) as Term[];

  return {
    activity: data?.section.instructionalMethod ?? "",
    facultyHours: data?.section.facultyHours,
    instructor: data?.section.instructors[0] ?? "",
    terms,
  };
};

export const mapNonTeachingLoadInput = (data: NonTeachingLoadInput) => {
  const newSection: Section = cloneDeep(emptySection);
  const newCourse: Course = cloneDeep(emptyCourse);
  newSection.instructionalMethod = data.activity;
  newSection.facultyHours = data.facultyHours;
  newSection.instructors = [data.instructor];
  newSection.isNonTeaching = true;
  newSection.term = data.terms;
  return { newCourse, newSection };
};
