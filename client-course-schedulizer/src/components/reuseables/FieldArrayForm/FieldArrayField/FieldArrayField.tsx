import { Box, TextField } from "@material-ui/core";
import React from "react";
import { Controller } from "react-hook-form";
import { useFieldArrayFormContext } from "utilities";

interface FieldArrayFieldProps {
  fieldIndex: string;
  index: number;
}

/**
 * A single field in a field array. There could be multiple fields per row
 *   or just one.
 */
export const FieldArrayField = ({ index, fieldIndex }: FieldArrayFieldProps) => {
  const {
    control,
    titleCaseName: name,
    defaultValue = {},
    textFieldProps,
  } = useFieldArrayFormContext();

  return (
    <Box m={1}>
      <Controller
        as={<TextField {...textFieldProps} label={fieldIndex} variant="outlined" />}
        control={control}
        defaultValue={defaultValue[fieldIndex]}
        name={`${name}[${index}][${fieldIndex}]`}
      />
    </Box>
  );
};
