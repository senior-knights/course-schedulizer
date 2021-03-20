import React from "react";
import { HarmonyAccessors, HarmonyState, useHarmonyStore } from "utilities/hooks";
import { HarmonyCourseCheckboxes } from "./HarmonyCourseChecboxes";

// pick values from store.
const selector = ({ courses }: HarmonyState) => {
  return courses;
};

/**
 * Section on Harmony page designed to allow users to input
 *   assignment restrictions for courses.
 */
export const HarmonyAddAssignments = () => {
  const courses = useHarmonyStore(selector);
  return (
    <>
      <h3>Add Assignments</h3>
      {(courses as HarmonyAccessors["courses"]).map((courseObj) => {
        return <HarmonyCourseCheckboxes key={courseObj.Course} course={courseObj.Course} />;
      })}
      {/* <Button type="submit">Submit</Button>
      <Button>Download JSON</Button>
      <Button>Upload JSON</Button> */}
    </>
  );
};
