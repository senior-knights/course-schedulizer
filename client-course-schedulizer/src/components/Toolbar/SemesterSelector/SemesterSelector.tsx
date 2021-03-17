import { IconButton, Typography } from "@material-ui/core";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import React, { useContext } from "react";
import { enumArray, Term } from "utilities";
import { AppContext, ScheduleContext } from "utilities/contexts";
import "./SemesterSelector.scss";

export const SemesterSelector = () => {
  const terms: Term[] = enumArray(Term);
  const {
    appState: { selectedTerm },
    appDispatch,
  } = useContext(AppContext);
  const { setIsScheduleLoading } = useContext(ScheduleContext);

  const handleOnClick = (index: number) => {
    return async () => {
      setIsScheduleLoading(true);
      const newTerm = terms[index];
      // This action takes so long it affectively makes this
      //  synchronous function asynchronous.
      await appDispatch({
        payload: { selectedTerm: newTerm },
        type: "setSelectedTerm",
      });
      setIsScheduleLoading(false);
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
