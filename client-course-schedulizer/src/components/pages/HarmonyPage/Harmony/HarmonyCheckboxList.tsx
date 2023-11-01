import { ClassLimits } from "@harmoniously/react";
import React, { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import { HarmonyAssignmentsState, useHarmonyAssignmentsStore } from "utilities/hooks";
import { HarmonyCheckbox } from "./HarmonyCheckbox";

interface HarmonyCheckboxListProps<T> {
  course: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customLabel?: (obj: any) => string;
  id: string;
  list: T;
  setList: Dispatch<SetStateAction<string[]>>;
}

/** Multiple check boxes for a specific attribute: rooms, times, professors */
export const HarmonyCheckboxList = <T extends unknown[]>({
  list,
  course,
  id,
  customLabel,
  setList,
}: HarmonyCheckboxListProps<T>) => {
  const assignments = useHarmonyAssignmentsStore(assignmentsSelector);

  const inferredAssignmentsList = useMemo(() => {
    const inferredAssignments = assignments[course][id as keyof ClassLimits];
    return inferredAssignments;
  }, [assignments, course, id]);

  useEffect(() => {
    setList(inferredAssignmentsList);
  });

  return (
    <div>
      <h3>{id}</h3>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {list.map((itemObj: any) => {
        const item: string =
          (customLabel && customLabel(itemObj)) || itemObj[Object.keys(itemObj)[0]];
        const defaultValue = inferredAssignmentsList.includes(item);
        return (
          <HarmonyCheckbox
            defaultValue={defaultValue}
            item={item}
            key={`${item}-${course}`}
            setList={setList}
          />
        );
      })}
    </div>
  );
};

HarmonyCheckboxList.defaultProps = {
  customLabel: undefined,
};

const assignmentsSelector = ({ assignments }: HarmonyAssignmentsState) => {
  return assignments;
};
