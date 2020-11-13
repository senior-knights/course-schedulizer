import { IconButton, Typography } from "@material-ui/core";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import React, { useContext } from "react";
import { Term } from "../../../utilities/interfaces/dataInterfaces";
import { AppContext } from "../../../utilities/services/appContext";
import "./SemesterSelector.scss";

export const SemesterSelector = () => {
  const terms: Term[] = Object.keys(Term).map((term) => {
    return Term[term as keyof typeof Term];
  });
  const {
    appState: { selectedTerm },
    appDispatch,
  } = useContext(AppContext);
  return (
    <div className="semester-selector">
      <IconButton
        disabled={selectedTerm === terms[0]}
        onClick={() => {
          const newTerm = terms[terms.indexOf(selectedTerm) - 1];
          appDispatch({
            payload: { term: newTerm },
            type: "setSelectedTerm",
          });
        }}
      >
        <ChevronLeft />
      </IconButton>
      <Typography variant="h6">{selectedTerm}</Typography>
      <IconButton
        disabled={selectedTerm === terms[terms.length - 1]}
        onClick={() => {
          const newTerm = terms[terms.indexOf(selectedTerm) + 1];
          appDispatch({
            payload: { term: newTerm },
            type: "setSelectedTerm",
          });
        }}
      >
        <ChevronRight />
      </IconButton>
    </div>
  );
};
