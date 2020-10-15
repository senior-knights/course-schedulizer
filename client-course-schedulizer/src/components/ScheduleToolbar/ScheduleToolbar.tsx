import { IconButton, InputLabel, MenuItem, Select, TextField, Typography } from "@material-ui/core";
import { Add, ChevronLeft, ChevronRight } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import React, { ChangeEvent, useState } from "react";
import "./ScheduleToolbar.scss";

const styles = {
  searchBar: {
    width: 300,
  },
};

export const ScheduleToolbar = () => {
  const [colorValue, setColorValue] = useState("10");

  const handleColorChange = (event: ChangeEvent<{ value: unknown }>) => {
    setColorValue(event.target.value as string);
  };

  return (
    <div className="schedule-toolbar">
      <Autocomplete
        getOptionLabel={(option) => {
          return `${option.name}-${option.section}`;
        }}
        id="combo-box-demo"
        options={classes}
        renderInput={(params) => {
          return <TextField {...params} label="Search" variant="outlined" />;
        }}
        style={styles.searchBar}
      />
      <div>
        <InputLabel id="label">Color By</InputLabel>
        <Select id="select" labelId="label" onChange={handleColorChange} value={colorValue}>
          <MenuItem value={10}>Level</MenuItem>
          <MenuItem value={20}>Room</MenuItem>
          <MenuItem value={30}>Instructor</MenuItem>
          <MenuItem value={40}>Prefix</MenuItem>
        </Select>
      </div>
      <div className="semester-selector">
        <IconButton>
          <ChevronLeft />
        </IconButton>
        <Typography variant="h6">Fall</Typography>
        <IconButton>
          <ChevronRight />
        </IconButton>
      </div>
      <IconButton>
        <Add />
      </IconButton>
    </div>
  );
};

const classes = [
  { instructor: "Victor T. Norman", name: "CS-108", section: "A" },
  { instructor: "Victor T. Norman", name: "CS-108", section: "B" },
  { instructor: "Joel Adams", name: "CS-112", section: "A" },
];
