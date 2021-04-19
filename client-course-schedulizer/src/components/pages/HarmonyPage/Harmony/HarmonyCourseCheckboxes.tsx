import { Box, Button, Card, CardContent, Grid } from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import {
  HarmonyAssignmentsState,
  HarmonyFormsAccessors,
  HarmonyFormsState,
  HarmonyStepperCallbackState,
  SingularAccessors,
  useHarmonyAssignmentsStore,
  useHarmonyFormsStore,
  useHarmonyStepperCallback,
} from "utilities/hooks";
import { HarmonyCheckboxList } from "./HarmonyCheckboxList";

interface HarmonyCourseCheckboxesProps {
  course: string;
}

/** All of the check box lists for each attribute for a specific class */
export const HarmonyCourseCheckboxes = ({ course }: HarmonyCourseCheckboxesProps) => {
  const [professors, times, rooms] = useHarmonyFormsStore(selector);
  const setClass = useHarmonyAssignmentsStore(assignmentsSelector);
  const pushCallbacks = useHarmonyStepperCallback(stepperSelector);

  const [profList, setProfList] = useState<string[]>([]);
  const [timeList, setTimeList] = useState<string[]>([]);
  const [roomList, setRoomList] = useState<string[]>([]);

  const onSave = useCallback(() => {
    setClass(course, { professors: profList, rooms: roomList, times: timeList });
  }, [course, profList, roomList, setClass, timeList]);

  useEffect(() => {
    pushCallbacks(onSave);
  }, [onSave, pushCallbacks]);

  return (
    <Box mb={2}>
      <Card variant="outlined">
        <CardContent>
          <h2>{course}</h2>
          <Grid container justify="space-around">
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
          </Grid>
          <Button onClick={onSave} type="button">
            Save
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

// pick values from store.
const selector = ({ professors, times, rooms }: HarmonyFormsState) => {
  return [professors, times, rooms];
};

const assignmentsSelector = ({ setClass }: HarmonyAssignmentsState) => {
  return setClass;
};

const stepperSelector = (state: HarmonyStepperCallbackState) => {
  return state.pushCallbacks;
};
