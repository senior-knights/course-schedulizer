import React from "react";
import { HarmonyFormsAccessors, HarmonyFormsState, useHarmonyFormsStore } from "utilities/hooks";
import { HarmonyCourseCheckboxes } from "./HarmonyCourseChecboxes";

// pick values from store.
const selector = ({ courses }: HarmonyFormsState) => {
  return courses;
};

/**
 * Section on Harmony page designed to allow users to input
 *   assignment restrictions for courses.
 */
export const HarmonyAddAssignments = () => {
  const courses = useHarmonyFormsStore(selector);
  return (
    <>
      <h3>Add Assignments</h3>
      {(courses as HarmonyFormsAccessors["courses"]).map((courseObj) => {
        return <HarmonyCourseCheckboxes key={courseObj.Course} course={courseObj.Course} />;
      })}
      {/* <Button type="submit">Submit</Button>
      <Button>Download JSON</Button>
      <Button>Upload JSON</Button> */}
    </>
  );
};
