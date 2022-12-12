import { TextField } from "@material-ui/core";
import { Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason } from "@material-ui/lab";
import React, { ChangeEvent, useContext } from "react";
import { AppContext } from "utilities/contexts";
import "./Searchbar.scss";

// const notSupported = [{ label: "The searchbar is not supported yet." }];
const supported = [
  { label: "Enter regex search term." },
];

export const Searchbar = () => {
  const {
    appState: { searchRegex },
    appDispatch,
    setIsCSVLoading,
  } = useContext(AppContext);

  const handleSearchRegexChange = (
    event: ChangeEvent<{}>, 
    value: string | { label: string; } | null, 
    reason: AutocompleteChangeReason, 
    details?: AutocompleteChangeDetails<{ label: string; }> | undefined) => {
    setIsCSVLoading(true);
    const searchRegexNew = (typeof value === "string" ? value : value?.label ?? "") as string; // event.target.value as string;
    appDispatch({ payload: { searchRegex: searchRegexNew }, type: "setSearchRegex" });
    // eslint-disable-next-line
    console.log({searchRegexNew});
    setIsCSVLoading(false);
  };

  return (
    <Autocomplete
      className="searchbar"
      defaultValue=""
      freeSolo
      getOptionLabel={(option) => {
        return option.label ?? option;
      }}
      id="search-box"
      noOptionsText="Enter a regex search term..."
      onChange={handleSearchRegexChange} 
      options = {supported} 
      renderInput={(params) => {
        return <TextField {...params} label="Filter" variant="outlined" />;
      }}
      value={searchRegex || ''}
    />
  );
};


