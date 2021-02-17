import { InputLabel, MenuItem, Select } from "@material-ui/core";
import React, { ChangeEvent, useState } from "react";
import "./ColorSelector.scss";

export enum ColorBy {
  Level,
  Room,
  Instructor,
  Prefix,
}

export const ColorSelector = () => {
  const [colorValue, setColorValue] = useState(ColorBy.Level);

  const handleColorChange = (event: ChangeEvent<{ value: unknown }>) => {
    setColorValue(event.target.value as ColorBy);
  };

  return (
    <div>
      <InputLabel id="label">Color By</InputLabel>
      <Select id="color-select" onChange={handleColorChange} value={colorValue}>
        <MenuItem value={ColorBy.Level}>Level</MenuItem>
        <MenuItem value={ColorBy.Room}>Room</MenuItem>
        <MenuItem value={ColorBy.Instructor}>Instructor</MenuItem>
        <MenuItem value={ColorBy.Prefix}>Prefix</MenuItem>
      </Select>
    </div>
  );
};
