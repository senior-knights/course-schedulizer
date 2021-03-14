import { Button } from "@material-ui/core";
import React from "react";
import { useFieldArrayFormContext } from "utilities";

/** Buttons at the bottom of the FieldArrayForm that allow the
 *   user to add more rows to the form and submit it.
 */
export const FieldArrayFormActionButtons = () => {
  const { append, defaultValue, titleCaseName } = useFieldArrayFormContext();

  return (
    <>
      <Button
        color="secondary"
        onClick={() => {
          append(defaultValue || {});
        }}
        style={{ margin: "1em" }}
        type="button"
        variant="outlined"
      >
        Add {titleCaseName}
      </Button>

      <Button color="primary" style={{ margin: "1em" }} type="submit" variant="outlined">
        Submit
      </Button>
    </>
  );
};
