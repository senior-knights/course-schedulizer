import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React from "react";
import "./Searchbar.scss";

export const Searchbar = () => {
  return (
    <Autocomplete
      className="searchbar"
      getOptionLabel={(option) => {
        return option.label;
      }}
      id="combo-box-demo"
      options={notSupported}
      renderInput={(params) => {
        return <TextField {...params} label="Search" variant="outlined" />;
      }}
    />
  );
};

const notSupported = [{ label: "The searchbar is not supported yet." }];
