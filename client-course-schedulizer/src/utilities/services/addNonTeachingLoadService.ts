import { cloneDeep, map } from "lodash";
import {
  Course,
  CourseSectionMeeting,
  Meeting,
  NonTeachingLoadInput,
  Section,
  Term,
} from "utilities";
import { emptyCourse, emptyMeeting, emptySection } from "utilities/constants";

export type CheckboxTerms = (Term | boolean)[];

export const mapNonTeachingLoadValuesToInput = (
  data?: CourseSectionMeeting,
): NonTeachingLoadInput => {
  const terms = addFalseToTermsCheckboxList(data?.section.term as Term[]);

  return {
    activity: data?.section.instructionalMethod ?? "",
    facultyHours: data?.section.facultyHours,
    instructor: data?.section.instructors[0] ?? "",
    terms,
  };
};

export const mapNonTeachingLoadInput = (data: NonTeachingLoadInput) => {
  const newMeeting: Meeting = cloneDeep(emptyMeeting);
  const newSection: Section = cloneDeep(emptySection);
  const newCourse: Course = cloneDeep(emptyCourse);
  newSection.instructionalMethod = data.activity;
  newSection.facultyHours = data.facultyHours;
  newSection.instructors = [data.instructor];
  newSection.isNonTeaching = true;
  newSection.term = data.terms as Term[];
  return { newCourse, newMeeting, newSection };
};

export const addFalseToTermsCheckboxList = (terms?: Term[]): CheckboxTerms => {
  const termValues = Object.values(Term);
  if (!terms) {
    return new Array(termValues.length).fill(false);
  }
  return map(termValues, (t) => {
    return terms.includes(t) ? t : false;
  });
};
