import { InputLabel, MenuItem, Select } from "@material-ui/core";
import React, { ChangeEvent, useContext } from "react";
import { AppContext } from "utilities/contexts";
import { SemesterLength } from "utilities/interfaces";
import "./SemesterPartSelector.scss";

export const SemesterPartSelector = () => {
  const {
    appState: { selectedSemesterPart },
    appDispatch,
    setIsCSVLoading,
  } = useContext(AppContext);

  const handleSemesterPartChange = (event: ChangeEvent<{ value: unknown }>) => {
    setIsCSVLoading(true);
    const semesterPart = event.target.value as SemesterLength;
    appDispatch({ payload: { selectedSemesterPart: semesterPart }, type: "setSelectedSemesterPart" });
    setIsCSVLoading(false);
  };

  return (
    <div>
      <InputLabel id="label">Semester Part</InputLabel>
      <Select id="semester-part-select" onChange={handleSemesterPartChange} value={selectedSemesterPart}>
        <MenuItem value={SemesterLength.Full}>Full</MenuItem>
        <MenuItem value={SemesterLength.HalfFirst}>First Half</MenuItem>
        <MenuItem value={SemesterLength.HalfSecond}>Second Half</MenuItem>
        <MenuItem value={SemesterLength.IntensiveA}>Intensive A</MenuItem>
        <MenuItem value={SemesterLength.IntensiveB}>Intensive B</MenuItem>
        <MenuItem value={SemesterLength.IntensiveC}>Intensive C</MenuItem>
        <MenuItem value={SemesterLength.IntensiveD}>Intensive D</MenuItem>
      </Select>
    </div>
  );
};
