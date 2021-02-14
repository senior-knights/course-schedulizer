import { cloneDeep } from "lodash";
import { Course, NonTeachingLoadInput, Section } from "utilities";
import { emptyCourse, emptySection } from "utilities/constants";

export const mapNonTeachingLoadInput = (data: NonTeachingLoadInput) => {
  const newSection: Section = cloneDeep(emptySection);
  const newCourse: Course = cloneDeep(emptyCourse);
  newSection.instructionalMethod = data.name;
  newSection.facultyHours = data.facultyHours;
  newSection.instructors = [data.instructor];
  newSection.isNonTeaching = true;
  newSection.term = data.terms;
  return { newCourse, newSection };
};
