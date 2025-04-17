import React from "react";
import { HarmonyFormsAccessors, HarmonyFormsState, useHarmonyFormsStore } from "utilities/hooks";
import { HarmonyCourseCheckboxes } from "./HarmonyCourseCheckboxes";

/**
 * Section on Harmony page designed to allow users to input
 *   assignment restrictions for courses.
 */
export const HarmonyAddAssignments = () => {
  const courses = useHarmonyFormsStore(selector);
  return (
    <>
      {(courses as HarmonyFormsAccessors["courses"]).map((courseObj) => {
        return <HarmonyCourseCheckboxes course={courseObj.Course} key={courseObj.Course} />;
      })}
    </>
  );
};

// pick values from store.
const selector = ({ courses }: HarmonyFormsState) => {
  return courses;
};
