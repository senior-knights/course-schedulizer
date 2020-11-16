import { IconButton, Typography } from "@material-ui/core";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import React, { useContext } from "react";
import { enumArray } from "../../../utilities/helpers/utils";
import { Term } from "../../../utilities/interfaces/dataInterfaces";
import { AppContext } from "../../../utilities/services/appContext";
import "./SemesterSelector.scss";

export const SemesterSelector = () => {
  const terms: Term[] = enumArray(Term);
  const {
    appState: { selectedTerm },
    appDispatch,
  } = useContext(AppContext);

  const handleOnClick = (index: number) => {
    return () => {
      const newTerm = terms[index];
      appDispatch({
        payload: { term: newTerm },
        type: "setSelectedTerm",
      });
    };
  };

  return (
    <div className="semester-selector">
      <IconButton
        disabled={selectedTerm === terms[0]}
        onClick={handleOnClick(terms.indexOf(selectedTerm) - 1)}
      >
        <ChevronLeft />
      </IconButton>
      <Typography variant="h6">{selectedTerm}</Typography>
      <IconButton
        disabled={selectedTerm === terms[terms.length - 1]}
        onClick={handleOnClick(terms.indexOf(selectedTerm) + 1)}
      >
        <ChevronRight />
      </IconButton>
    </div>
  );
};
