import { Dispatch } from "react";

/*
"A thunk is a function that wraps an expression to delay its evaluation." - redux-thunk
This is a custom hook that returns a promise that resolves when the dispatch action
  has completed. This makes a reducer compatible with async methods.

References:
  - https://stackoverflow.com/questions/47565389/call-function-after-dispatch-from-redux-has-finished
  - https://github.com/reduxjs/redux-thunk

Future design?
  Use `react-use` and `redux-thunk` as a middle ware for the dispatch
  as that likely has more functionality than my current useThunk hook.
  https://github.com/streamich/react-use/blob/master/docs/createReducer.md
*/
export const useThunk = <T>(dispatch: Dispatch<T>) => {
  return (action: T) => {
    return new Promise((resolve) => {
      dispatch(action);

      resolve();
    });
  };
};
