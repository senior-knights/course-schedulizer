import { Card, CardContent, TextFieldProps } from "@material-ui/core";
import startCase from "lodash/startCase";
import toLower from "lodash/toLower";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FieldArrayFormProvider } from "utilities";
import { FieldArrayFields } from "./FieldArrayFields";
import { FieldArrayFormActionButtons } from "./FieldArrayFormActionButtons";

export interface FieldArrayFormProps {
  defaultValue: object;
  defaultValues?: object[];
  fieldsName: string;
  onSubmit?: (data: object[]) => void;
  textFieldProps?: TextFieldProps;
}

/**
 * FieldArrayForm creates a form with a variable amount of fields all for similar values.
 * This uses a provider to pass form related data down the component tree.
 * Handles the form submission and formats the name to look nice on the web.
 */
export const FieldArrayForm = ({
  fieldsName,
  defaultValue,
  defaultValues = [],
  onSubmit,
  textFieldProps,
}: FieldArrayFormProps) => {
  const titleCaseName = startCase(toLower(fieldsName));
  const formMethods = useForm({
    defaultValues: {
      [titleCaseName]: [...defaultValues, defaultValue],
    },
  });
  const { control, handleSubmit } = formMethods;
  const fieldArrayMethods = useFieldArray({
    control,
    name: titleCaseName,
  });

  return (
    <FieldArrayFormProvider
      {...formMethods}
      {...fieldArrayMethods}
      defaultValue={defaultValue}
      defaultValues={defaultValues}
      textFieldProps={textFieldProps}
      titleCaseName={titleCaseName}
    >
      <Card style={{ marginBottom: "2em" }} variant="outlined">
        <CardContent>
          <form
            onSubmit={handleSubmit((data) => {
              onSubmit && onSubmit(data[titleCaseName] as object[]);
            })}
          >
            <h2>{titleCaseName}: </h2>
            <FieldArrayFields />
            <FieldArrayFormActionButtons />
          </form>
        </CardContent>
      </Card>
    </FieldArrayFormProvider>
  );
};

FieldArrayForm.defaultProps = {
  onSubmit: undefined,
};
