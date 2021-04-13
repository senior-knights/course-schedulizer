import { Card, CardContent } from "@material-ui/core";
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
    <Card style={{ marginBottom: "2em" }} variant="outlined">
      <CardContent>
        <h2>{course}</h2>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
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
        </div>
      </CardContent>
    </Card>
  );
};

// pick values from store.
const selector = ({ professors, times, rooms }: HarmonyFormsState) => {
  return [professors, times, rooms];
};
