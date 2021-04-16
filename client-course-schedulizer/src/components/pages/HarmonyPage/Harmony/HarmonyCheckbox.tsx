import { Checkbox, Grid } from "@material-ui/core";
import React, { ChangeEvent, Dispatch, SetStateAction, useCallback, useState } from "react";

interface HarmonyCheckboxProps {
  item: string;
  setList: Dispatch<SetStateAction<string[]>>;
}

/** A single check box to update lists on the Harmony page */
export const HarmonyCheckbox = ({ setList, item }: HarmonyCheckboxProps) => {
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
    <Grid alignItems="center" container>
      <Checkbox checked={checked} onChange={handleChange(item)} /> {item}
    </Grid>
  );
};
