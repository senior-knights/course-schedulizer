import { InputLabel, MenuItem, Select } from "@material-ui/core";
import React, { ChangeEvent, useContext } from "react";
import { AppContext } from "utilities/contexts";
import { ColorBy } from "utilities/interfaces";
import "./ColorSelector.scss";

export const ColorSelector = () => {
  const {
    appState: { colorBy },
    appDispatch,
    setIsCSVLoading,
  } = useContext(AppContext);

  const handleColorChange = (event: ChangeEvent<{ value: unknown }>) => {
    setIsCSVLoading(true);
    const selectedColorBy = event.target.value as ColorBy;
    appDispatch({ payload: { colorBy: selectedColorBy }, type: "setColorBy" });
    setIsCSVLoading(false);
  };

  return (
    <div>
      <InputLabel id="label">Color By</InputLabel>
      <Select id="color-select" onChange={handleColorChange} value={colorBy}>
        <MenuItem value={ColorBy.Level}>Level</MenuItem>
        <MenuItem value={ColorBy.Room}>Room</MenuItem>
        <MenuItem value={ColorBy.Instructor}>Instructor</MenuItem>
        <MenuItem value={ColorBy.Prefix}>Prefix</MenuItem>
      </Select>
    </div>
  );
};
