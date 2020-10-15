import { InputLabel, MenuItem, Select } from "@material-ui/core";
import React, { ChangeEvent, useState } from "react";
import "./ColorSelector.scss";

export const ColorSelector = () => {
  const [colorValue, setColorValue] = useState("10");

  const handleColorChange = (event: ChangeEvent<{ value: unknown }>) => {
    setColorValue(event.target.value as string);
  };

  return (
    <div>
      <InputLabel id="label">Color By</InputLabel>
      <Select id="select" labelId="label" onChange={handleColorChange} value={colorValue}>
        <MenuItem value={10}>Level</MenuItem>
        <MenuItem value={20}>Room</MenuItem>
        <MenuItem value={30}>Instructor</MenuItem>
        <MenuItem value={40}>Prefix</MenuItem>
      </Select>
    </div>
  );
};
