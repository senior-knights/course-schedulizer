import { InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React, { useContext } from "react";
import { AppContext } from "utilities/contexts";
import { ColorBy } from "utilities/interfaces";
import "./ColorSelector.scss";

export const ColorSelector = () => {
  const {
    appState: { colorBy },
    appDispatch,
    setIsCSVLoading,
  } = useContext(AppContext);

  const handleColorChange = (event: SelectChangeEvent<ColorBy>) => {
    setIsCSVLoading(true);
    const selectedColorBy = event.target.value as ColorBy;
    appDispatch({ payload: { colorBy: selectedColorBy }, type: "setColorBy" });
    setIsCSVLoading(false);
  };

  return (
    <div>
      <InputLabel id="label">Color By</InputLabel>
      <Select id="color-select" onChange={handleColorChange} value={colorBy} variant="standard">
        <MenuItem value={ColorBy.Level}>Level</MenuItem>
        <MenuItem value={ColorBy.Room}>Room</MenuItem>
        <MenuItem value={ColorBy.Instructor}>Instructor</MenuItem>
        <MenuItem value={ColorBy.Prefix}>Prefix</MenuItem>
        <MenuItem value={ColorBy.Group}>Group</MenuItem>
      </Select>
    </div>
  );
};
