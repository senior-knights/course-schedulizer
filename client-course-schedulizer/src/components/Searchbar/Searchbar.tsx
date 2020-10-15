import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React from "react";
import "./Searchbar.scss";

const styles = {
  searchBar: {
    width: 300,
  },
};

export const Searchbar = () => {
  return (
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
  );
};

const classes = [
  { instructor: "Victor T. Norman", name: "CS-108", section: "A" },
  { instructor: "Victor T. Norman", name: "CS-108", section: "B" },
  { instructor: "Joel Adams", name: "CS-112", section: "A" },
];
