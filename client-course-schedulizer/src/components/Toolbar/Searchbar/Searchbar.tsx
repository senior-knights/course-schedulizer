import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React from "react";
import "./Searchbar.scss";

export const Searchbar = () => {
  return (
    <Autocomplete
      className="searchbar"
      getOptionLabel={(option) => {
        return `${option.name}-${option.section}`;
      }}
      id="combo-box-demo"
      options={classes}
      renderInput={(params) => {
        return <TextField {...params} label="Search" variant="outlined" />;
      }}
    />
  );
};

const classes = [
  { instructor: "Victor T. Norman", name: "CS-108", section: "A" },
  { instructor: "Victor T. Norman", name: "CS-108", section: "B" },
  { instructor: "Joel Adams", name: "CS-112", section: "A" },
];
