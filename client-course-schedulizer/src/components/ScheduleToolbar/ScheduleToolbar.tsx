import { IconButton } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React from "react";
import { ColorSelector } from "../ColorSelector/ColorSelector";
import { Searchbar } from "../Searchbar";
import { SemesterSelector } from "../SemesterSelector";
import "./ScheduleToolbar.scss";

export const ScheduleToolbar = () => {
  return (
    <div className="schedule-toolbar">
      <Searchbar />
      <ColorSelector />
      <SemesterSelector />
      <IconButton>
        <Add />
      </IconButton>
    </div>
  );
};
