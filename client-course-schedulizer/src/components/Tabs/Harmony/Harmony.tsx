import { Harmony as H } from "@harmoniously/react";
import { Assignments } from "harmoniously";
import React, { useContext } from "react";
import { AppContext } from "utilities/contexts";

// TODO: change this
const times = ["mwf800", "mwf900", "mwf1030", "mwf1130", "mwf1230", "mwf130", "mwf230", "mwf330"];

const useInferredAssignments = (): Assignments => {
  const {
    appState: { rooms, professors, classes },
  } = useContext(AppContext);

  const thing: Assignments = {};
  classes.forEach((cls) => {
    thing[cls] = {
      // TODO: update this. https://stackoverflow.com/a/5915122/9931154
      professor: professors[Math.floor(Math.random() * professors.length)],
      rooms: [...rooms, "a", "b"],
      times,
    };
  });

  return thing;
};

export const Harmony = () => {
  const assignments = useInferredAssignments();
  console.log(assignments);

  return <H assignments={assignments} />;
};
