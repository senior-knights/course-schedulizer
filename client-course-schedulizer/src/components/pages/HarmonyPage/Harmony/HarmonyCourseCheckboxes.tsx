import { Box, Paper } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
  HarmonyFormsAccessors,
  HarmonyFormsState,
  SingularAccessors,
  useHarmonyAssignmentsStore,
  useHarmonyFormsStore,
} from "utilities/hooks";
import { HarmonyCheckboxList } from "./HarmonyCheckboxList";

interface HarmonyCourseCheckboxesProps {
  course: string;
}

// pick values from store.
const selector = ({ professors, times, rooms }: HarmonyFormsState) => {
  return [professors, times, rooms];
};

/** All of the check box lists for each attribute for a specific class */
export const HarmonyCourseCheckboxes = ({ course }: HarmonyCourseCheckboxesProps) => {
  const [professors, times, rooms] = useHarmonyFormsStore(selector);
  const { setClass } = useHarmonyAssignmentsStore();
  const [profList, setProfList] = useState<string[]>([]);
  const [timeList, setTimeList] = useState<string[]>([]);
  const [roomList, setRoomList] = useState<string[]>([]);

  useEffect(() => {
    setClass(course, { professors: profList, rooms: roomList, times: timeList });
  }, [course, profList, roomList, setClass, timeList]);

  return (
    <Box component="div" m={2}>
      <Paper>
        <b>{course}</b>
        <HarmonyCheckboxList
          course={course}
          customLabel={(profObj: SingularAccessors["professor"]) => {
            return `${profObj.First} ${profObj.Last}`;
          }}
          id="professors"
          list={professors as HarmonyFormsAccessors["professors"]}
          setList={setProfList}
        />
        <HarmonyCheckboxList
          course={course}
          id="times"
          list={times as HarmonyFormsAccessors["times"]}
          setList={setTimeList}
        />
        <HarmonyCheckboxList
          course={course}
          id="rooms"
          list={rooms as HarmonyFormsAccessors["rooms"]}
          setList={setRoomList}
        />
      </Paper>
    </Box>
  );
};
