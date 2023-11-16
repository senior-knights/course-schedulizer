import { Grid } from "@material-ui/core";
import React from "react";
import { useFieldArrayFormContext } from "utilities";
import { DeleteFieldButton } from "../DeleteFieldButton";
import { FieldArrayField } from "../FieldArrayField";

/**
 * Creates one row in the FieldArrayForm. Renders multiple fields
 *   if there are more keys in the original object.
 */
export const FieldArrayFields = () => {
  const { fields } = useFieldArrayFormContext();

  return (
    <>
      {fields.map((field, index) => {
        return (
          <Grid container key={field.id}>
            <DeleteFieldButton index={index} />
            {Object.keys(field)
              .filter((f) => {
                return f !== "id";
              })
              .map((key) => {
                return <FieldArrayField fieldIndex={key} index={index} key={key} />;
              })}
          </Grid>
        );
      })}
    </>
  );
};
