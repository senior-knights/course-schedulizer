import { Box, Button, Checkbox, Paper } from "@material-ui/core";
import { AnimateShowAndHide, HarmonyFieldArrayForm } from "components";
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useAssignmentsStore } from "utilities/hooks";
import {
  HarmonyAccessors,
  HarmonyState,
  SingularAccessors,
  useHarmonyStore,
} from "utilities/hooks/useHarmonyStore";
import { Harmony } from "./Harmony";

// pick values from harmony store.
const selector = ({ professors, courses, times, rooms }: HarmonyState) => {
  return [professors, courses, times, rooms];
};

/**
 * The page contains all of the Harmoniously user-experience.
 *   Allows the user to load professor, courses, rooms, and times from
 *   the uploaded schedule as well as edit them and create assignments (constraints).
 * Harmony will find schedules with no conflicts and allow the user to send it back
 *   to the Schedulizer to make edits.
 */
export const HarmonyPage = () => {
  return (
    <>
      <AnimateShowAndHide>Harmony</AnimateShowAndHide>
      <h1>
        Note: This page is in a <i>pre-alpha</i> state. Output might not be perfect.
      </h1>
      <HarmonyFieldArrayForm defaultValue={{ First: "", Last: "" }} fieldsName="professors" />
      <HarmonyFieldArrayForm defaultValue={{ Course: "" }} fieldsName="courses" />
      <HarmonyFieldArrayForm defaultValue={{ Room: "" }} fieldsName="rooms" />
      <HarmonyFieldArrayForm defaultValue={{ Time: "" }} fieldsName="times" />
      <AddAssignments />
      <Harmony />
    </>
  );
};

const AddAssignments = () => {
  const [, courses] = useHarmonyStore(selector);
  return (
    <>
      <h3>Add Assignments</h3>
      {(courses as HarmonyAccessors["courses"]).map((courseObj) => {
        return <CourseCheckboxes key={courseObj.Course} course={courseObj.Course} />;
      })}
      <Button type="submit">Submit</Button>
      <Button>Download JSON</Button>
      <Button>Upload JSON</Button>
    </>
  );
};

interface CourseCheckboxesProps {
  course: string;
}

// All of the check box lists for each attribute for a specific class
const CourseCheckboxes = ({ course }: CourseCheckboxesProps) => {
  const [professors, , times, rooms] = useHarmonyStore(selector);
  const [profList, setProfList] = useState<string[]>([]);
  const [timeList, setTimeList] = useState<string[]>([]);
  const [roomList, setRoomList] = useState<string[]>([]);
  const { setClass } = useAssignmentsStore();

  useEffect(() => {
    setClass(course, { professors: profList, rooms: roomList, times: timeList });
  }, [course, profList, roomList, setClass, timeList]);

  return (
    <Box component="div" m={2}>
      <Paper>
        <b>{course}</b>
        <CheckboxList
          course={course}
          customLabel={(profObj: SingularAccessors["professor"]) => {
            return `${profObj.First} ${profObj.Last}`;
          }}
          id="professors"
          list={professors as HarmonyAccessors["professors"]}
          setList={setProfList}
        />
        <CheckboxList
          course={course}
          id="times"
          list={times as HarmonyAccessors["times"]}
          setList={setTimeList}
        />
        <CheckboxList
          course={course}
          id="rooms"
          list={rooms as HarmonyAccessors["rooms"]}
          setList={setRoomList}
        />
      </Paper>
    </Box>
  );
};

interface CheckboxList<T> {
  course: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customLabel?: (obj: any) => string;
  id: string;
  list: T;
  setList: Dispatch<SetStateAction<string[]>>;
}

// Multiple check boxes for a specific attribute: rooms, times, professors
const CheckboxList = <T extends unknown[]>({
  list,
  course,
  id,
  customLabel,
  setList,
}: CheckboxList<T>) => {
  return (
    <>
      <h4>{id}</h4>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {list.map((itemObj: any) => {
        const item: string =
          (customLabel && customLabel(itemObj)) || itemObj[Object.keys(itemObj)[0]];
        return <HarmonyCheckbox key={`${item}-${course}`} item={item} setList={setList} />;
      })}
    </>
  );
};

CheckboxList.defaultProps = {
  customLabel: undefined,
};

interface HarmonyCheckboxProps {
  item: string;
  setList: Dispatch<SetStateAction<string[]>>;
}

// A single checkbox
const HarmonyCheckbox = ({ setList, item }: HarmonyCheckboxProps) => {
  const [checked, setChecked] = useState(false);

  const handleChange = useCallback(
    (clickedItem: string) => {
      return (event: ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setChecked(isChecked);
        if (isChecked) {
          setList((prevState) => {
            return [...prevState, clickedItem];
          });
        } else {
          setList((prevState) => {
            return prevState.filter((i) => {
              return i !== clickedItem;
            });
          });
        }
      };
    },
    [setList],
  );

  return (
    <div>
      {item} <Checkbox checked={checked} onChange={handleChange(item)} />
    </div>
  );
};
