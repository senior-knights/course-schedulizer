import React, { Dispatch, SetStateAction } from "react";
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
  return (
    <div>
      <h3>{id}</h3>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {list.map((itemObj: any) => {
        const item: string =
          (customLabel && customLabel(itemObj)) || itemObj[Object.keys(itemObj)[0]];
        return <HarmonyCheckbox key={`${item}-${course}`} item={item} setList={setList} />;
      })}
    </div>
  );
};

HarmonyCheckboxList.defaultProps = {
  customLabel: undefined,
};
